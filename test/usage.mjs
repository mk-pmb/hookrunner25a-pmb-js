// -*- coding: utf-8, tab-width: 2 -*-

import test from 'p-tape';

import makeHookRunner from '../index.mjs';

// import tu from './libTestUtil.mjs';


test('Basic usage example', async (t) => {
  t.plan(8);
  const runHook = makeHookRunner();
  t.same(await runHook('getColors'),
    { hookName: 'getColors', hookAborted: false });
  t.same(await runHook('getSizes'),
    { hookName: 'getSizes', hookAborted: false });
  t.same(await runHook('getColors', { list: '' }),
    { hookName: 'getColors', hookAborted: false, list: '' });
  t.same(await runHook('getSizes', { list: '' }),
    { hookName: 'getSizes', hookAborted: false, list: '' });

  let abort = null;
  runHook.add('getColors', state => ({ list: state.list + 'white,' }));
  runHook.add('getColors', state => (abort || { list: state.list + 'grey,' }));
  runHook.add('getColors', state => ({ list: state.list + 'black,' }));
  runHook.add('getSizes', state => ({ list: state.list + 'small,' }));
  runHook.add('getSizes', state => ({ list: state.list + 'medium,' }));
  runHook.add('getSizes', state => (abort || { list: state.list + 'large,' }));
  t.same(await runHook('getColors', { list: '' }),
    { hookName: 'getColors', hookAborted: false, list: 'white,grey,black,' });
  t.same(await runHook('getSizes', { list: '' }),
    { hookName: 'getSizes', hookAborted: false, list: 'small,medium,large,' });

  abort = 'ABORT';
  t.same(await runHook('getColors', { list: '' }),
    { hookName: 'getColors', hookAborted: true, list: 'white,' });
  t.same(await runHook('getSizes', { list: '' }),
    { hookName: 'getSizes', hookAborted: true, list: 'small,medium,' });
});







// *scroll*
