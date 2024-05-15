importScripts('/javascripts/idb-utility.js');


// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
    console.log('Service Worker: Installing....');
    event.waitUntil((async () => {

        console.log('Service Worker: Caching App Shell at the moment......');
        try {
            const cache = await caches.open("static");
            cache.addAll([
                '/',
                '/add',
                '/manifest.json',
                '/javascripts/index.js',
                '/javascripts/idb-utility.js',
                '/javascripts/chatHandler.js',
                '/javascripts/usernameHandler.js',
                '/javascripts/add.js',
                '/stylesheets/style.css',
                '/stylesheets/index.css',
            ]);
            //TODO add images to cache?
            console.log('Service Worker: App Shell Cached');
        }
        catch{
            console.log("error occurred while caching...")
        }

    })());
});

//clear cache on reload
self.addEventListener('activate', event => {
    console.log("ACTIVATE EVENT")
// Remove old caches
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            return keys.map(async (cache) => {
                if(cache !== "static") {
                    console.log('Service Worker: Removing old cache: '+cache);
                    return await caches.delete(cache);
                }
            })
        })()
    )
})

// Fetch event to fetch from cache first
self.addEventListener('fetch', event => {
    console.log("FETCH EVENT")
    event.respondWith((async () => {
        const cache = await caches.open("static");
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
            console.log('Service Worker: Fetching from Cache: ', event.request.url);
            return cachedResponse;
        }
        console.log('Service Worker: Fetching from URL: ', event.request.url);
        return fetch(event.request);
    })());
});

//Sync event to sync the plants
self.addEventListener('sync', event => {
    console.log("SYNC EVENT")
    if (event.tag === 'sync-plant') {
        console.log('Service Worker: Syncing new Plants');
        openSyncPlantsIDB().then((syncPostDB) => {
            getAllSyncPlants(syncPostDB).then((syncPlants) => {
                for (const syncPlant of syncPlants) {
                    console.log('Service Worker: Syncing new Plant: ', syncPlant.data.name);
                    // Create a FormData object
                    const formData = new URLSearchParams();

                    // Iterate over the properties of the JSON object and append them to FormData
                    formData.append("name", syncPlant.data.name);
                    formData.append("nameStatus", syncPlant.data.nameStatus);
                    formData.append("description", syncPlant.data.description);
                    formData.append("img", syncPlant.data.img)
                    formData.append("height", syncPlant.data.height);
                    formData.append("spread", syncPlant.data.spread);
                    formData.append("leaves", syncPlant.data.leaves);
                    formData.append("flowers", syncPlant.data.flowers);
                    formData.append("flowerColour", syncPlant.data.flowerColour);
                    formData.append("fruitSeeds", syncPlant.data.fruitSeeds);
                    formData.append("sunExposure", syncPlant.data.sunExposure);
                    formData.append("location", syncPlant.data.location);
                    formData.append("dateOfSighting", syncPlant.data.dateOfSighting);
                    formData.append("username", syncPlant.data.username);
                    formData.append("suggestedNames", syncPlant.data.suggestedNames)


                    // Fetch with FormData instead of JSON
                    fetch('http://localhost:3000/add-plant', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }).then(() => {
                        console.log('Service Worker: Syncing new Plant: ', syncPlant.data.name, ' done');
                        deleteSyncPlantFromIDB(syncPostDB,syncPlant.id);
                        console.log("here?")
                        // Send a notification
                        self.registration.showNotification('Plant Synced', {
                            body: 'Plant synced successfully!',
                        });

                    }).catch((err) => {
                        console.error('Service Worker: Syncing new Plant: ', syncPlant.data.name, ' failed');
                    });
                }
            });
        });
    }
});
