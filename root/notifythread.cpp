/* Copyright 2012-present Facebook, Inc.
 * Licensed under the Apache License, Version 2.0 */

#include "watchman.h"
#include "InMemoryView.h"

namespace watchman {

// we want to consume inotify events as quickly as possible
// to minimize the risk that the kernel event buffer overflows,
// so we do this as a blocking thread that reads the inotify
// descriptor and then queues the filesystem IO work until after
// we have drained the inotify descriptor
void InMemoryView::notifyThread(const std::shared_ptr<w_root_t>& root) {
  PendingCollection pending;
  auto localLock = pending.lock();

  if (!watcher_->start(root)) {
    logf(
        ERR,
        "failed to start root {}, cancelling watch: {}\n",
        root->root_path,
        root->failure_reason);
    root->cancel();
    return;
  }

  // signal that we're done here, so that we can start the
  // io thread after this point
  pending_.lock()->ping();

  while (!stopThreads_) {
    // big number because not all watchers can deal with
    // -1 meaning infinite wait at the moment
    if (watcher_->waitNotify(86400)) {
      while (true) {
        auto [addedPending, cancelSelf] =
            watcher_->consumeNotify(root, localLock);

        if (cancelSelf) {
          root->cancel();
          break;
        }

        if (!addedPending) {
          break;
        } else {
          if (localLock->size() >= WATCHMAN_BATCH_LIMIT) {
            break;
          }
          if (!watcher_->waitNotify(0)) {
            break;
          }
        }
      }
      if (localLock->size() > 0) {
        auto lock = pending_.lock();
        lock->append(&*localLock);
        lock->ping();
      }
    }
  }
}
} // namespace watchman

/* vim:ts=2:sw=2:et:
 */
