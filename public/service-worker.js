const APP_PREFIX = 'budget_tracker';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
  '/',
  './css/styles.css',
  './index.html',
  './js/idb.js',
  './js/index.js',
  './manifest.json',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png',
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function (cache) {

                console.log(`Cache ${CACHE_NAME} is installing!`)
        
                return cache.addAll(FILES_TO_CACHE)
            })
    )
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(list) {
            let keepList = list.filter(function(key) {
                return key.indexOf(APP_PREFIX);
            });
            
            keepList.push(CACHE_NAME);

            return Promise.all(
                list.map(function(key, i) {
                    if (keepList.indexOf(key) === -1) {

                        console.log(`Cache ${list[i]} deleting`);
                        return caches.delete(list[i]);
                    }
                })
            )
        })
    )
});


self.addEventListener('fetch', function(e) {

    e.respondWith(
        caches.match(e.request).then(function (request) {
            if(request){
                return request
            }
            return fetch(e.request);
        })
    );
});





