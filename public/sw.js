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
                '/plant',
                '/manifest.json',
                '/javascripts/index.js',
                '/javascripts/idb-utility.js',
                '/javascripts/chatHandler.js',
                '/javascripts/usernameHandler.js',
                '/javascripts/add.js',
                '/javascripts/plant.js',
                '/stylesheets/style.css',
                '/stylesheets/index.css',
                '/stylesheets/plant.css'
            ]);
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
    })("error"));
});

//Sync event to sync the plants
self.addEventListener('sync', event => {
    console.log("SYNC/UPDATE EVENT")
    if (event.tag === 'sync-plant') {
        console.log('Service Worker: Syncing new Plants');
        openSyncPlantsIDB().then((syncPostDB) => {
            getAllSyncPlants(syncPostDB).then((syncPlants) => {
                openSyncChatIDB().then((syncChatIDB) => {
                    getPendingSyncChats(syncChatIDB).then((syncChats) => {
                        for (let syncPlant of syncPlants) {
                            let syncPlantChats = syncPlant.data.chat
                            for(const syncChat of syncChats) {
                                if(syncChat.data.plantId == syncPlant.id)
                                {
                                    syncPlantChats.push(syncChat.data)
                                    console.log(syncPlantChats)
                                }
                            }
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
                            formData.append("chat",syncPlantChats)


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
                    })
                })


            });
        });

    }
    else if(event.tag === "update-plant")
    {
        console.log('Service Worker: Updating Plants');
        openUpdatePlantsIDB().then((updatePostDB) => {
            getAllUpdatePlants(updatePostDB).then((updatePlants) => {
                for (const updatePlant of updatePlants) {
                    console.log('Service Worker: Updating Plant: ', updatePlant.data.name);
                    // Create a FormData object
                    const formData = new URLSearchParams();

                    // Iterate over the properties of the JSON object and append them to FormData
                    formData.append("_id", updatePlant.data._id);
                    formData.append("name", updatePlant.data.name);
                    formData.append("nameStatus", updatePlant.data.nameStatus);

                    // Fetch with FormData instead of JSON
                    fetch('http://localhost:3000/update-plant', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }).then(() => {
                        console.log('Service Worker: Updating Plant: ', updatePlant.data.name, ' done');
                        deleteUpdatePlantFromIDB(updatePostDB,updatePlant.id);
                        console.log("here?")
                        // Send a notification
                        self.registration.showNotification('Plant Updated', {
                            body: 'Plant updated successfully!',
                        });

                    }).catch((err) => {
                        console.error('Service Worker: Updating new Plant: ', updatePlant.data.name, ' failed');
                    });
                }

            });
        });
    }
    else if(event.tag === "update-chat")
    {
        console.log('Service Worker: Syncing Chats');
        openChatIDB().then((chatDB) => {
            getPendingChats(chatDB).then((chats) => {
                for (const chat of chats) {
                    console.log('Service Worker: Syncing Chat');
                    // Create a FormData object
                    const formData = new URLSearchParams();

                    // Iterate over the properties of the JSON object and append them to FormData
                    formData.append("chatUsername", chat.data.chatUsername);
                    formData.append("chatText", chat.data.chatText);
                    formData.append("chatTimeStamp", chat.data.chatTime);
                    formData.append("plantId", chat.data.plantId)


                    // Fetch with FormData instead of JSON
                    fetch('http://localhost:3000/update-chat', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }).then(() => {
                        console.log("Service Worker: Updating Plant Chats done");
                        deleteChatFromIDB(chatDB,chat.id).then(() => {
                            self.registration.showNotification('Plant Chat Uploaded', {
                                body: 'Plant chats uploaded!',
                            });
                        })
                    })

                }

            });
        });
    }
});
