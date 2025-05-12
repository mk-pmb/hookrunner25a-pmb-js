
<!--#echo json="package.json" key="name" underline="=" -->
hookrunner25a-pmb
==================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Rudimentary EventEmitter-style event manager for running serially async
handler chains that update a shared state object unless the chain is aborted.
<!--/#echo -->



API
---

This module exports one function:

### makeHookRunner()

Returns a fresh new `runHook` function that will have this API:

### runHook(hookName[, initialState[, prepareIfAny]])

Return a promise for the state object that will resolve once the chain ended.
The state will start as

<!--#include file="index.mjs" outdent="    " code="javascript"
  start="    // #BEGIN# readme:initialState"
  stop="    // #ENDOF# readme:initialState" -->
<!--#verbatim lncnt="3" -->
```javascript
const hookState = { hookName, hookAborted: false, ...initialState };
```
<!--/include-->

If there are no hook functions registered for `hookName`,
the chain ends immediately, and the initial state is returned.

Otherwise, the actual chain is determined,
starting with `prepareIfAny` if is truthy,
and then all the actual hook functions.

* The functions in the chain will be await-ed in series,
  as long as `hookAborted` stays false-y.
* They will be called with a single argument, `hookState`.
* If their result is truthy, it will be `Object.assign`ed
  into the `hookState`, unless it's one of these magic strings:
  * `'ABORT'` will instead be treated as `{ hookAborted: true }`.


### runHook.add(hookName, hookFunc)

Append `hookFunc` to the chain for `hookName`.
Throws an error is it's already on that chain.
Otherwise, return a success object whose `unsubscribe` key will hold
a function that can be called once to remove `hookFunc` from the chain.







Usage
-----

:TODO:



<!--#toc stop="scan" -->



Related projects
----------------

* [eventemitter2](https://npm.im/eventemitter2)
  has way cooler features, but lacks the event state updating magic
  and I'm not sure if it can run handlers in series.
* [eventemitter3](https://npm.im/eventemitter3)
  also is really neat but cannot run handlers in series.
* [hookable](https://npm.im/hookable)
  isn't clear about the extent of their promises support
  (as of 2025-05-12 / v5.5.3, the only mention of "promise" is in a
  migration note) and seems to have no abort feature.
  Also not clear whether promising hooks can run in series.





Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key="license" -->
ISC
<!--/#echo -->
