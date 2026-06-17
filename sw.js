// Service Worker — MRTN Prospector
// Estratégia inteligente: HTML sempre busca rede primeiro (atualizações instantâneas),
// assets ficam no cache (rápido offline).
const CACHE = 'martinelle-v3';
const ASSETS = [
  './manifest.json',
  './icon.svg',
];

// Instala — pré-cacheia só assets estáticos (não o HTML!)
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

// Ativa — apaga TODOS os caches antigos (de versões anteriores)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Estratégia por tipo de recurso
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const isHTML = e.request.mode === 'navigate' ||
                 e.request.destination === 'document' ||
                 url.pathname.endsWith('.html') ||
                 url.pathname === '/' ||
                 url.pathname === '';

  if(isHTML){
    // NETWORK-FIRST para HTML: sempre tenta servidor primeiro.
    // Se rede falhar (offline), usa cache. Se cache vazio, mostra erro.
    e.respondWith(
      fetch(e.request).then(res => {
        if(res && res.status === 200){
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request))
    );
  } else {
    // CACHE-FIRST para assets (ícone, manifest, scripts externos)
    e.respondWith(
      caches.match(e.request).then(cached => {
        if(cached) return cached;
        return fetch(e.request).then(res => {
          if(res && res.status === 200 && res.type !== 'opaque'){
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        });
      })
    );
  }
});
