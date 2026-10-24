'use strict';

function assertPatchedNode22(version) {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) throw new Error(`Unsupported Node.js version: ${version}`);
  const [, major, minor, patch] = match.map(Number);
  if (major !== 22 || minor < 23 || (minor === 23 && patch < 4)) {
    throw new Error(`Node.js ${version} is not supported. CVE-2026-111497 requires Node.js 22.23.4 or later in the 22.x line. Run nvm install && nvm use, or select Node.js 22.x in your hosting settings.`);
  }
}

if (require.main === module) {
  try {
    assertPatchedNode22(process.versions.node);
    console.log(`Node.js ${process.versions.node}: security version check passed`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

exports.assertPatchedNode22 = assertPatchedNode22;
