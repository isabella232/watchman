/* Copyright 2012-present Facebook, Inc.
 * Licensed under the Apache License, Version 2.0 */

#include "watchman.h"
#include "FileDescriptor.h"
#include "Pipe.h"

#ifdef HAVE_KQUEUE

namespace watchman {

struct KQueueWatcher : public Watcher {
  FileDescriptor kq_fd;
  Pipe terminatePipe_;

  struct maps {
    std::unordered_map<w_string, FileDescriptor> name_to_fd;
    /* map of active watch descriptor to name of the corresponding item */
    std::unordered_map<int, w_string> fd_to_name;

    explicit maps(json_int_t sizeHint) {
      name_to_fd.reserve(sizeHint);
      fd_to_name.reserve(sizeHint);
    }
  };
  folly::Synchronized<maps> maps_;
  bool recursive_;

  struct kevent keventbuf[WATCHMAN_BATCH_LIMIT];

  explicit KQueueWatcher(w_root_t* root, bool recursive = true);

  std::unique_ptr<watchman_dir_handle> startWatchDir(
      const std::shared_ptr<w_root_t>& root,
      struct watchman_dir* dir,
      const char* path) override;

  bool startWatchFile(struct watchman_file* file) override;

  Watcher::ConsumeNotifyRet consumeNotify(
      const std::shared_ptr<w_root_t>& root,
      PendingCollection::LockedPtr& coll) override;

  bool waitNotify(int timeoutms) override;
  void signalThreads() override;
};

} // namespace watchman

#endif
