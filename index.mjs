// -*- coding: utf-8, tab-width: 2 -*-

import loMapValues from 'lodash.mapvalues';
import mustBe from 'typechecks-pmb/must-be';
import pEachSeries from 'p-each-series';


const voidUnsub = { delete() { throw new Error('Already unsubscribed!'); } };

function ores(x) { return x || ''; }
function orf(x) { return x || false; }


const EX = function makeHookRunner(opt) {
  const core = new Map();
  const { runHook, ...api } = loMapValues(EX.api, v => v.bind(null, core));
  const { name } = orf(opt);
  core.name = name;
  core.trace = (name ? ' on ' + name : '');
  Object.assign(core, api);
  Object.assign(runHook, api);
  return runHook;
};


Object.assign(EX, {

  errAddHookDupe(hookName, trace) {
    const msg = 'Duplicate hook registration for ' + hookName + ores(trace);
    const err = new Error(msg);
    err.name = 'DuplicateHookError';
    err.hookName = hookName;
    throw err;
  },

});


EX.api = {

  async runHook(core, hookName, initialState, prepareIfAny) {
    mustBe.nest('The hook name', hookName);
    // #BEGIN# readme:initialState
    const hookState = { hookName, hookAborted: false, ...initialState };
    // #ENDOF# readme:initialState
    let funcs = core.get(hookName);
    if (!funcs) { return hookState; }
    funcs = [prepareIfAny, ...funcs.values()];
    pEachSeries(funcs, async function wrapHookCall(hookFunc) {
      if (!hookFunc) { return; }
      if (hookState.hookAborted) { return; }
      const upd = await hookFunc(hookState);
      if (!upd) { return; }
      if (upd === 'ABORT') {
        hookState.hookAborted = true;
        return;
      }
      Object.assign(hookState, upd);
    });
    return hookState;
  },


  add(core, hookName, hookFunc) {
    mustBe.nest('The hook name', hookName);
    mustBe.fun('The hook function for ' + hookName + core.trace, hookFunc);
    let funcs = core.get(hookName);
    if (funcs) {
      if (funcs.has(hookFunc)) { EX.errAddHookDupe(hookName, core.trace); }
    } else {
      funcs = new Set();
      core.set(hookName, funcs);
    }
    funcs.add(hookFunc);
    const r = {
      unsubscribe() {
        funcs.delete(hookFunc);
        funcs = voidUnsub;
      },
    };
    return r;
  },


};


export default EX;
