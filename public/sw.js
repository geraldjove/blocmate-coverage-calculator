// Self-destroying service worker.
//
// An earlier version of this app was built with vite-plugin-pwa, which
// registered a Workbox service worker that pre-cached the app shell. That
// service worker outlives the app: browsers that visited the old version keep
// being served the stale, cached shell even after a new version is deployed.
//
// This file replaces that service worker. When a trapped browser checks /sw.js
// for an update it receives this script, which clears all caches, unregisters
// itself, and reloads open tabs so the visitor lands on the current build.
// Once the app is registration-free, no service worker remains.

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
      await self.registration.unregister()
      await self.clients.claim()
      const clients = await self.clients.matchAll({ type: 'window' })
      for (const client of clients) {
        client.navigate(client.url)
      }
    })(),
  )
})
