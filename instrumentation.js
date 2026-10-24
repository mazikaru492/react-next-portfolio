// Run before a Node.js server instance starts handling requests, including
// managed serverless cold starts that do not invoke npm start.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { assertPatchedNode22 } = await import('./scripts/check-node-security.cjs');
    assertPatchedNode22(process.versions.node);
  }
}
