const CACHE_NAME = 'expenseiq-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/', '/index.html'])
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = event.request.url

  // ✅ Skip non-GET, API calls, chrome extensions, browser internals
  if (event.request.method !== 'GET') return
  if (url.includes('/api/')) return
  if (url.startsWith('chrome-extension://')) return
  if (url.startsWith('chrome://')) return
  if (!url.startsWith('http')) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache valid same-origin responses
        if (response && response.ok && response.type === 'basic') {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => {
            try { cache.put(event.request, clone) } catch {
              // Silently ignore cache.put errors
            }
          })
        }
        return response
      })
      .catch(() => {
        return caches.match(event.request)
          .then(cached => cached || caches.match('/index.html'))
      })
  )
})