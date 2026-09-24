/**
 * sw.js — Service Worker do Robô em Recuperação
 * Estratégia: Cache-First com atualização em segundo plano (Stale-While-Revalidate)
 * Garante 100% de funcionamento offline após a primeira visita.
 */

const CACHE_NAME = 'robo-em-recuperacao-v5';

// Todos os recursos do jogo a serem cacheados na instalação
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './js/state.js',
  './js/ranking.js',
  './js/audio.js',
  './js/input.js',
  './js/entities.js',
  './js/renderer.js',
  './js/main.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// --- Instalação: pré-cacheia todos os recursos ---
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cacheando recursos do jogo...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      console.log('[SW] Todos os recursos cacheados! Jogo disponível offline.');
      return self.skipWaiting(); // Ativa imediatamente sem esperar reload
    })
  );
});

// --- Ativação: limpa caches antigos de versões anteriores ---
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Removendo cache antigo:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim()) // Controla todas as abas abertas
  );
});

// --- Fetch: Cache-First (serve do cache; busca rede em segundo plano) ---
self.addEventListener('fetch', (event) => {
  // Ignorar requisições não-GET ou de extensões do browser
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Busca atualização em rede em paralelo (sem bloquear)
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Falha de rede — sem problema, já temos o cache
      });

      // Retorna do cache instantaneamente (ou aguarda rede se não tiver cache)
      return cachedResponse || fetchPromise;
    })
  );
});
