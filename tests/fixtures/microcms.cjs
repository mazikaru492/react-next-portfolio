'use strict';

// CI-only data for production builds without access to a real CMS or its keys.
// Enabled explicitly through NODE_OPTIONS in the security workflow, never by
// application code. Requests to every other host retain their normal behavior.
const realFetch = globalThis.fetch;
globalThis.fetch = async function fixtureFetch(input, init) {
  const value = typeof input === 'string' || input instanceof URL ? input : input.url;
  const url = new URL(value);
  if (url.hostname !== 'ci-node-security.microcms.io') {
    return realFetch(input, init);
  }
  const body = url.pathname.endsWith('/profile')
    ? {
        id: 'ci-profile', name: 'CI profile', title: 'Build validation', subtitle: '',
        createdAt: '2026-10-24T00:00:00Z', updatedAt: '2026-10-24T00:00:00Z',
        publishedAt: '2026-10-24T00:00:00Z', revisedAt: '2026-10-24T00:00:00Z',
      }
    : { contents: [], totalCount: 0, offset: 0, limit: 10 };
  return new Response(JSON.stringify(body), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};
