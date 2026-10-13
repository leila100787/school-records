// ============================================
// SERVICE WORKER — PWA офлайн жұмыс үшін
// ============================================

const CACHE_NAME = 'school-records-v1';
const RUNTIME_CACHE = 'school-records-runtime-v1';

// Кэштейтін файлдар
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/login.html',
  '/register.html',
  '/admin.html',
  '/student.html',
  '/css/style.css',
  '/js/i18n.js',
  '/manifest.json'
];

// Орнату — кэштеу
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker: Орнатылуда...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Кэштеу:', PRECACHE_URLS.length, 'файл');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Белсендіру — ескі кэшті тазалау
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Белсендірілуде...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map(name => {
            console.log('🗑️ Ескі кэш өшірілуде:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Сұраныстарды өңдеу
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API сұраныстарын кэштемеу (әрқашан жаңа деректер керек)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Желі қатесі' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // Басқа сұраныстар — кэштен, болмаса желіден
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        // Кэштен берді, бірақ фонда жаңартамыз
        fetch(request).then(response => {
          if (response.ok) {
            caches.open(RUNTIME_CACHE).then(cache => {
              cache.put(request, response.clone());
            });
          }
        }).catch(() => {});
        
        return cachedResponse;
      }

      // Кэште жоқ — желіден аламыз
      return fetch(request).then(response => {
        // Тек GET сұраныстарын кэштейміз
        if (request.method === 'GET' && response.ok) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Желі де жоқ — офлайн бетті көрсетеміз
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Push хабарламалар (болашақта)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Мектеп Рекордтары';
  const options = {
    body: data.body || 'Жаңа хабарлама',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-96.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Хабарламаны басу
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

console.log('🎉 Service Worker жүктелді!');