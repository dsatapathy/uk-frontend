import test from 'node:test';
import assert from 'node:assert/strict';
import REG, {
  registerComponent,
  getComponent,
  registerAction,
  getAction,
  registerGuard,
  getGuard,
  registerLayout,
  getLayout,
} from './registry.js';

const cases = [
  {
    kind: 'Component',
    register: registerComponent,
    get: getComponent,
    map: REG.components,
    value1: () => () => 'comp1',
    value2: () => () => 'comp2',
  },
  {
    kind: 'Action',
    register: registerAction,
    get: getAction,
    map: REG.actions,
    value1: () => () => 'action1',
    value2: () => () => 'action2',
  },
  {
    kind: 'Guard',
    register: registerGuard,
    get: getGuard,
    map: REG.guards,
    value1: () => () => true,
    value2: () => () => false,
  },
  {
    kind: 'Layout',
    register: registerLayout,
    get: getLayout,
    map: REG.layouts,
    value1: () => ({ layout: 1 }),
    value2: () => ({ layout: 2 }),
  },
];

for (const { kind, register, get, map, value1, value2 } of cases) {
  test(`${kind} duplicate registration warns and skips by default`, () => {
    const originalWarn = console.warn;
    let warned = false;
    console.warn = () => {
      warned = true;
    };

    const first = value1();
    const second = value2();
    register('X', first);
    register('X', second);

    assert.strictEqual(get('X'), first);
    assert.ok(warned);

    console.warn = originalWarn;
    map.clear();
  });

  test(`${kind} duplicate registration can overwrite`, () => {
    const originalWarn = console.warn;
    let warned = false;
    console.warn = () => {
      warned = true;
    };

    const first = value1();
    const second = value2();
    register('Y', first);
    register('Y', second, true);

    assert.strictEqual(get('Y'), second);
    assert.ok(warned);

    console.warn = originalWarn;
    map.clear();
  });
}