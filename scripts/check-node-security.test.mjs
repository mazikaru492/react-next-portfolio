import assert from 'node:assert/strict';
import test from 'node:test';
import { assertPatchedNode22 } from './check-node-security.cjs';

test('rejects vulnerable, unsupported and prerelease runtimes', () => {
  for (const version of ['18.20.0', '20.20.2', '22.22.0', '22.23.3',
    '23.0.0', '24.22.1', '22.23.4-rc.1', 'invalid']) {
    assert.throws(() => assertPatchedNode22(version), Error, version);
  }
});

test('accepts the fixed Node.js 22 release and later patches', () => {
  for (const version of ['22.23.4', 'v22.23.4', '22.23.5', '22.24.0']) {
    assert.doesNotThrow(() => assertPatchedNode22(version), version);
  }
});
