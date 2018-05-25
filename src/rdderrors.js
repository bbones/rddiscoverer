'use strict'

class BaseError extends Error {
  constructor (message) {
    super(message)
    this.name = 'RDDiscoverer base error'
    Error.captureStackTrace(this, this.constructor)
  }
}
exports.BaseError = BaseError

/**
 * Optimistic Lock Error Error. Thrown when the repository update modified record
 */
class OptimisticLockError extends BaseError {
  constructor (parent) {
    super(parent)
    this.name = 'SequelizeScopeError'
    Error.captureStackTrace(this, this.constructor)
  }
}
exports.OptimisticLockError = OptimisticLockError
