// -*- coding: utf-8, tab-width: 2 -*-

import makeHookRunner from '../index.mjs';


const TU = {

  makeRunHookChecker(t) {
    const runHook = makeHookRunner();

    async function checkRunHook(hookName, extraInitState, expectedStateModif) {
      const { initialState, prepareIfAny } = checkRunHook;
      const optionalArgs = [];
      if (initialState) { optionalArgs[0] = initialState; }
      if (extraInitState) { /*
        Merge only if we need to: Otherwise, pass the original initialState
        so we can test whether it will be modified inplace, and to preserve
        primitive values. */
        optionalArgs[0] = { ...optionalArgs[0], ...extraInitState };
      }
      if (prepareIfAny) { optionalArgs[1] = prepareIfAny; }
      const report = await runHook(hookName, ...optionalArgs);
      t.same(report, {
        hookName,
        hookAborted: false,
        ...initialState,
        ...extraInitState,
        ...expectedStateModif,
      });
      return report;
    }

    function spy(x) { return TU.pushAndReturn(spy.log, x); }
    spy.log = [];

    return { runHook, checkRunHook, spy };
  },


  keys(x) { return Object.keys(x || false).sort().join(' '); },
  keysEq(t, x, w) { t.equal(TU.keys(x), w); },

  pushAndReturn(a, x) {
    a.push(x);
    return x;
  },



};


export default TU;
