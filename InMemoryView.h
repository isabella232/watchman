/* Copyright 2012-present Facebook, Inc.
 * Licensed under the Apache License, Version 2.0 */
#pragma once
#include "watchman_system.h"
#include "watchman_string.h"
#include <folly/Synchronized.h>
#include <memory>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include "ContentHash.h"
#include "CookieSync.h"
#include "PendingCollection.h"
#include "QueryableView.h"
#include "SymlinkTargets.h"
#include "watchman_config.h"
#include "watchman_opendir.h"
#include "watchman_perf.h"
#include "watchman_query.h"

struct Watcher;
struct watchman_client;

namespace watchman {

// Helper struct to hold caches used by the InMemoryView
struct InMemoryViewCaches {
  ContentHashCache contentHashCache;
  SymlinkTargetCache symlinkTargetCache;

  InMemoryViewCaches(
      const w_string& rootPath,
      size_t maxHashes,
      size_t maxSymlinks,
      std::chrono::milliseconds errorTTL);
};

class InMemoryFileResult : public FileResult {
 public:
  explicit InMemoryFileResult(
      const watchman_file* file,
      InMemoryViewCaches& caches);
  folly::Optional<FileInformation> stat() override;
  folly::Optional<struct timespec> accessedTime() override;
  folly::Optional<struct timespec> modifiedTime() override;
  folly::Optional<struct timespec> changedTime() override;
  folly::Optional<size_t> size() override;
  w_string_piece baseName() override;
  w_string_piece dirName() override;
  folly::Optional<bool> exists() override;
  folly::Optional<w_string> readLink() override;
  folly::Optional<w_clock_t> ctime() override;
  folly::Optional<w_clock_t> otime() override;
  folly::Optional<FileResult::ContentHash> getContentSha1() override;
  void batchFetchProperties(
      const std::vector<std::unique_ptr<FileResult>>& files) override;

 private:
  const watchman_file* file_;
  w_string dirName_;
  InMemoryViewCaches& caches_;
  folly::Optional<w_string> symlinkTarget_;
  Result<FileResult::ContentHash> contentSha1_;
};

/** Keeps track of the state of the filesystem in-memory. */
struct InMemoryView : public QueryableView {
  ClockPosition getMostRecentRootNumberAndTickValue() const override;
  uint32_t getLastAgeOutTickValue() const override;
  time_t getLastAgeOutTimeStamp() const override;
  w_string getCurrentClockString() const override;

  explicit InMemoryView(w_root_t* root, std::shared_ptr<Watcher> watcher);

  void ageOut(w_perf_t& sample, std::chrono::seconds minAge) override;
  void syncToNow(
      const std::shared_ptr<w_root_t>& root,
      std::chrono::milliseconds timeout) override;

  bool doAnyOfTheseFilesExist(
      const std::vector<w_string>& fileNames) const override;

  /** Perform a time-based (since) query and emit results to the supplied
   * query context */
  void timeGenerator(w_query* query, struct w_query_ctx* ctx) const override;

  /** Walks files that match the supplied set of paths */
  void pathGenerator(w_query* query, struct w_query_ctx* ctx) const override;

  void globGenerator(w_query* query, struct w_query_ctx* ctx) const override;

  void allFilesGenerator(w_query* query, struct w_query_ctx* ctx)
      const override;

  std::shared_future<void> waitUntilReadyToQuery(
      const std::shared_ptr<w_root_t>& root) override;

  void startThreads(const std::shared_ptr<w_root_t>& root) override;
  void signalThreads() override;
  void wakeThreads() override;
  void clientModeCrawl(const std::shared_ptr<w_root_t>& root);

  const w_string& getName() const override;
  const std::shared_ptr<Watcher>& getWatcher() const;
  json_ref getWatcherDebugInfo() const override;

  // If content cache warming is configured, do the warm up now
  void warmContentCache();
  static void debugContentHashCache(
      struct watchman_client* client,
      const json_ref& args);
  static void debugSymlinkTargetCache(
      struct watchman_client* client,
      const json_ref& args);

  SCM* getSCM() const override;

 private:
  struct view {
    /* the most recently changed file */
    struct watchman_file* latest_file{0};

    std::unique_ptr<watchman_dir> root_dir;

    // Inode number for the root dir.  This is used to detect what should
    // be impossible situations, but is needed in practice to workaround
    // eg: BTRFS not delivering all events for subvolumes
    ino_t rootInode{0};

    explicit view(const w_string& root_path);

    void insertAtHeadOfFileList(struct watchman_file* file);
  };
  using SyncView = folly::Synchronized<view>;

  void ageOutFile(
      std::unordered_set<w_string>& dirs_to_erase,
      watchman_file* file);

  // Consume entries from pending and apply them to the InMemoryView
  bool processPending(
      const std::shared_ptr<w_root_t>& root,
      SyncView::LockedPtr& view,
      PendingCollection::LockedPtr& pending,
      bool pullFromRoot = false);
  void processPath(
      const std::shared_ptr<w_root_t>& root,
      SyncView::LockedPtr& view,
      PendingCollection::LockedPtr& coll,
      const w_string& full_path,
      struct timeval now,
      int flags,
      const watchman_dir_ent* pre_stat);

  /** Updates the otime for the file and bubbles it to the front of recency
   * index */
  void markFileChanged(
      SyncView::LockedPtr& view,
      watchman_file* file,
      const struct timeval& now);

  /** Mark a directory as being removed from the view.
   * Marks the contained set of files as deleted.
   * If recursive is true, is recursively invoked on child dirs. */
  void markDirDeleted(
      SyncView::LockedPtr& view,
      struct watchman_dir* dir,
      const struct timeval& now,
      bool recursive);

  watchman_dir*
  resolveDir(SyncView::LockedPtr& view, const w_string& dirname, bool create);
  const watchman_dir* resolveDir(
      SyncView::ConstLockedPtr& view,
      const w_string& dirname) const;

  /** Returns the direct child file named name if it already
   * exists, else creates that entry and returns it */
  watchman_file* getOrCreateChildFile(
      SyncView::LockedPtr& view,
      watchman_dir* dir,
      const w_string& file_name,
      const struct timeval& now);

  /** Recursively walks files under a specified dir */
  void dirGenerator(
      w_query* query,
      struct w_query_ctx* ctx,
      const watchman_dir* dir,
      uint32_t depth) const;
  void globGeneratorTree(
      struct w_query_ctx* ctx,
      const struct watchman_glob_tree* node,
      const struct watchman_dir* dir) const;
  void globGeneratorDoublestar(
      struct w_query_ctx* ctx,
      const struct watchman_dir* dir,
      const struct watchman_glob_tree* node,
      const char* dir_name,
      uint32_t dir_name_len) const;
  /** Crawl the given directory.
   *
   * Allowed flags:
   *  - W_PENDING_RECURSIVE: the directory will be recursively crawled,
   *  - W_PENDING_VIA_NOTIFY when the watcher only supports directory
   *    notification (WATCHER_ONLY_DIRECTORY_NOTIFICATIONS), this will stat all
   *    the files and directories contained in the passed in directory and stop.
   */
  void crawler(
      const std::shared_ptr<w_root_t>& root,
      SyncView::LockedPtr& view,
      PendingCollection::LockedPtr& coll,
      const w_string& dir_name,
      struct timeval now,
      int flags);
  void notifyThread(const std::shared_ptr<w_root_t>& root);
  void ioThread(const std::shared_ptr<w_root_t>& root);
  bool handleShouldRecrawl(const std::shared_ptr<w_root_t>& root);
  void fullCrawl(
      const std::shared_ptr<w_root_t>& root,
      PendingCollection::LockedPtr& pending);
  void statPath(
      const std::shared_ptr<w_root_t>& root,
      SyncView::LockedPtr& view,
      PendingCollection::LockedPtr& coll,
      const w_string& full_path,
      struct timeval now,
      int flags,
      const watchman_dir_ent* pre_stat);
  bool propagateToParentDirIfAppropriate(
      const std::shared_ptr<w_root_t>& root,
      PendingCollection::LockedPtr& coll,
      struct timeval now,
      const FileInformation& entryStat,
      const w_string& dirName,
      const watchman_dir* parentDir,
      bool isUnlink);

  CookieSync& cookies_;
  Configuration& config_;

  SyncView view_;
  // The most recently observed tick value of an item in the view
  std::atomic<uint32_t> mostRecentTick_{1};
  /* root number */
  std::atomic<uint32_t> rootNumber_{0};
  w_string root_path;

  // This allows a client to wait for a recrawl to complete.
  // The primary use of this is so that "watch-project" doesn't
  // send its return PDU to the client until after the initial
  // crawl is complete.  Note that a recrawl can happen at any
  // point, so this is a bit of a weak promise that a query can
  // be immediately executed, but is good enough assuming that
  // the system isn't in a perpetual state of recrawl.
  struct crawl_state {
    std::unique_ptr<std::promise<void>> promise;
    std::shared_future<void> future;
  };
  folly::Synchronized<crawl_state> crawlState_;

  uint32_t last_age_out_tick{0};
  time_t last_age_out_timestamp{0};

  /* queue of items that we need to stat/process */
  PendingCollection pending_;

  std::atomic<bool> stopThreads_{false};
  std::shared_ptr<Watcher> watcher_;

  // mutable because we pass a reference to other things from inside
  // const methods
  mutable InMemoryViewCaches caches_;

  // Should we warm the cache when we settle?
  bool enableContentCacheWarming_{false};
  // How many of the most recent files to warm up when settling?
  size_t maxFilesToWarmInContentCache_{1024};
  // If true, we will wait for the items to be hashed before
  // dispatching the settle to watchman clients
  bool syncContentCacheWarming_{false};
  // Remember what we've already warmed up
  uint32_t lastWarmedTick_{0};

  // The source control system that we detected during initialization
  std::unique_ptr<SCM> scm_;
};
} // namespace watchman
