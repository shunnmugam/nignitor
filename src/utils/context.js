const asyncHooks = require('async_hooks')

let contexts = {}

asyncHooks.createHook({
  init (asyncId, type, triggerAsyncId, resource) {
    if (contexts[triggerAsyncId] !== undefined) {
      contexts[asyncId] = contexts[triggerAsyncId]
    } else {
      contexts[asyncId] = {}
    }
  },

  destroy (asyncId) {
    delete contexts[asyncId]
  }
}).enable()


function run (callback) {
  let eid = asyncHooks.executionAsyncId()
  contexts[eid] = {}
  callback()
}

function set (k, v) {
  let eid = asyncHooks.executionAsyncId()
  let ctx = contexts[eid]
  if (ctx !== undefined) {
    ctx[k] = v
  }
}

function get (k) {
  let eid = asyncHooks.executionAsyncId()
  let ctx = contexts[eid]
  return ctx !== undefined ? ctx[k] : undefined
}

module.exports = {get, set, run, contexts}