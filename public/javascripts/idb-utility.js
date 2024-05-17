// Function to handle adding a new plant
const addNewPlantToSync = (syncPlantIDB, plant) => {
    // Retrieve plant and add it to the IndexedDB

    if (plant._id !== null && plant._id !== undefined) {
        const transaction = syncPlantIDB.transaction(["sync-plants"], "readwrite")
        const plantStore = transaction.objectStore("sync-plants")
        console.log("ADDED PLANT")
        console.log(plant)
        const addRequest = plantStore.add({data: plant})
        addRequest.addEventListener("success", () => {
            console.log("Added " + "#" + addRequest.result + ": " + plant.name)
            const getRequest = plantStore.get(addRequest.result)
            getRequest.addEventListener("success", () => {
                // Send a sync message to the service worker
                navigator.serviceWorker.ready.then((sw) => {
                    sw.sync.register("sync-plant")

                }).then(() => {
                    console.log("Sync registered");
                    window.location.replace('/')
                }).catch((err) => {
                    console.log("Sync registration failed: " + JSON.stringify(err))
                })
            })
        })
    }
}

const addNewPlantToUpdate = (updatePlantIDB, plant) => {
    // Retrieve plant and add it to the IndexedDB
    return new Promise( (resolve, reject) => {
        if (plant._id !== null && plant._id !== undefined) {
            const transaction = updatePlantIDB.transaction(["update-plants"], "readwrite")
            const plantStore = transaction.objectStore("update-plants")
            const addRequest = plantStore.add({data: plant})
            addRequest.addEventListener("success", () => {
                console.log("Added " + "#" + addRequest.result + ": " + plant.name)
                const getRequest = plantStore.get(addRequest.result)
                getRequest.addEventListener("success", () => {
                    // Send a sync message to the service worker
                    navigator.serviceWorker.ready.then((sw) => {
                        sw.sync.register("update-plant")

                    }).then(() => {
                        resolve();
                        console.log("Update registered");
                    }).catch((err) => {
                        reject(err);
                        console.log("Sync registration failed: " + JSON.stringify(err))
                    })
                })
            })
        }
    })

}

const addToUpdateBeforeUpdate = (updatePlantIDB, plant) => {
    // Retrieve plant and add it to the IndexedDB
    return new Promise( (resolve, reject) => {
        if (plant._id !== null && plant._id !== undefined) {
            const transaction = updatePlantIDB.transaction(["update-plants"], "readwrite")
            const plantStore = transaction.objectStore("update-plants")
            const addRequest = plantStore.add({data: plant})
            addRequest.addEventListener("success", () => {
                console.log("Added " + "#" + addRequest.result + ": " + plant.name)
                const getRequest = plantStore.get(addRequest.result)
                getRequest.addEventListener("success", () => {
                    // Send a sync message to the service worker
                    resolve();
                })
            })
        }
    })

}

// Function to add new plants to IndexedDB and return a promise
const addNewPlantsToIDB = (plantIDB, plants) => {
    return new Promise((resolve, reject) => {
        const transaction = plantIDB.transaction(["plants"], "readwrite");
        const plantStore = transaction.objectStore("plants");

        const addPromises = plants.map(plant => {
            return new Promise((resolveAdd, rejectAdd) => {
                const addRequest = plantStore.add(plant);
                addRequest.addEventListener("success", () => {
                    console.log("Added " + "#" + addRequest.result + ": " + plant.name);
                    const getRequest = plantStore.get(addRequest.result);
                    getRequest.addEventListener("success", () => {
                        // Assume insertPlantInList is defined elsewhere
                        insertPlantInList(getRequest.result);
                        resolveAdd(); // Resolve the add promise
                    });
                    getRequest.addEventListener("error", (event) => {
                        rejectAdd(event.target.error); // Reject the add promise if there's an error
                    });
                });
                addRequest.addEventListener("error", (event) => {
                    rejectAdd(event.target.error); // Reject the add promise if there's an error
                });
            });
        });

        // Resolve the main promise when all add operations are completed
        Promise.all(addPromises).then(() => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
};


const addNewPlantsToIDBFromView = (plantIDB, plants) => {
    return new Promise((resolve, reject) => {
        const transaction = plantIDB.transaction(["plants"], "readwrite");
        const plantStore = transaction.objectStore("plants");

        const addPromises = plants.map(plant => {
            return new Promise((resolveAdd, rejectAdd) => {
                const addRequest = plantStore.add(plant);
                addRequest.addEventListener("success", () => {
                    console.log("Added " + "#" + addRequest.result + ": " + plant.name);
                    const getRequest = plantStore.get(addRequest.result);
                    getRequest.addEventListener("success", () => {
                        resolveAdd(); // Resolve the add promise
                    });
                    getRequest.addEventListener("error", (event) => {
                        rejectAdd(event.target.error); // Reject the add promise if there's an error
                    });
                });
                addRequest.addEventListener("error", (event) => {
                    rejectAdd(event.target.error); // Reject the add promise if there's an error
                });
            });
        });

        // Resolve the main promise when all add operations are completed
        Promise.all(addPromises).then(() => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
};


// Function to remove all plants from idb
const deleteAllExistingPlantsFromIDB = (plantIDB) => {
    //TODO change so that plants are read and added when plants in idb already exist
    const transaction = plantIDB.transaction(["plants"], "readwrite");
    const plantStore = transaction.objectStore("plants");
    const clearRequest = plantStore.clear();

    return new Promise((resolve, reject) => {
        clearRequest.addEventListener("success", () => {
            resolve();
        });

        clearRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
};




// Function to get the plant list from the IndexedDB
const getAllPlants = (plantIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = plantIDB.transaction(["plants"]);
        const plantStore = transaction.objectStore("plants");
        const getAllRequest = plantStore.getAll();

        // Handle success event
        getAllRequest.addEventListener("success", (event) => {
            resolve(event.target.result); // Use event.target.result to get the result
        });

        // Handle error event
        getAllRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}


// Function to get the plant list from the IndexedDB
const getAllSyncPlants = (syncPlantIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = syncPlantIDB.transaction(["sync-plants"]);
        const plantStore = transaction.objectStore("sync-plants");
        const getAllRequest = plantStore.getAll();

        getAllRequest.addEventListener("success", () => {
            resolve(getAllRequest.result);
        });

        getAllRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}

const getAllUpdatePlants = (updatePlantIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = updatePlantIDB.transaction(["update-plants"]);
        const plantStore = transaction.objectStore("update-plants");
        const getAllRequest = plantStore.getAll();

        getAllRequest.addEventListener("success", () => {
            resolve(getAllRequest.result);
        });

        getAllRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}

const getSyncPlant = (id, syncPlantIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = syncPlantIDB.transaction(["sync-plants"]);
        const plantStore = transaction.objectStore("sync-plants");
        console.log(id)
        const getOneRequest = plantStore.get(id);

        getOneRequest.addEventListener("success", () => {
            resolve(getOneRequest.result);
        });

        getOneRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}

const getPlant = (id, plantIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = plantIDB.transaction(["plants"]);
        const plantStore = transaction.objectStore("plants");
        const getOneRequest = plantStore.get(id);

        getOneRequest.addEventListener("success", () => {
            resolve(getOneRequest.result);
        });

        getOneRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}

const getUpdatePlant = (id, updatePlantIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = updatePlantIDB.transaction(["update-plants"]);
        const plantStore = transaction.objectStore("update-plants");
        const getOneRequest = plantStore.get(id);

        getOneRequest.addEventListener("success", () => {
            resolve(getOneRequest.result);
        });

        getOneRequest.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}

const deletePlantFromIDB = (plantIDB, id) => {
    const transaction = plantIDB.transaction(["plants"], "readwrite")
    const plantStore = transaction.objectStore("plants")
    const deleteRequest = plantStore.delete(id)
    deleteRequest.addEventListener("success", () => {
        console.log("Deleted " + id)
    })
}

// Function to delete a synced plant
const deleteSyncPlantFromIDB = (syncPlantIDB, id) => {
    return new Promise((resolve, reject) => {
        const transaction = syncPlantIDB.transaction(["sync-plants"], "readwrite")
        const plantStore = transaction.objectStore("sync-plants")
        const deleteRequest = plantStore.delete(id)
        deleteRequest.addEventListener("success", () => {
            resolve();
            console.log("Deleted " + id)
        })
        deleteRequest.addEventListener("error", () => {
            reject();
        })
    })

}

const deleteUpdatePlantFromIDB = (syncPlantIDB, id) => {
    const transaction = syncPlantIDB.transaction(["update-plants"], "readwrite")
    const plantStore = transaction.objectStore("update-plants")
    const deleteRequest = plantStore.delete(id)
    deleteRequest.addEventListener("success", () => {
        console.log("Deleted " + id)
    })

}

//TODO FIX SO UPDATING CAN BE DONE OFFLINE
const updateSyncPlant = (plant, newName, newStatus, updateSyncIDB) => {
    const transaction = updateSyncIDB.transaction(["sync-plants"], "readwrite")
    const plantStore = transaction.objectStore("sync-plants")
    console.log("SYNC HERE")
    console.log(plant)
    plant.data.name = newName
    plant.data.nameStatus = newStatus
    console.log(plant.data.name)
    console.log(plant.data.nameStatus)
    console.log(plant.id)
    console.log("FULL PLANT")
    console.log(plant)
    const updateRequest = plantStore.put({data: plant.data}, {id: plant.id})
    updateRequest.addEventListener("success", () => {
        console.log("Updated " + plant.id)
    })
    updateRequest.addEventListener("error", () => {
        console.log("Failed Updating " + plant.id)
    })
}

const updateUpdatePlant = (plant, newName, newStatus, updatePlantIDB) => {
    const transaction = updatePlantIDB.transaction(["update-plants"], "readwrite")
    const plantStore = transaction.objectStore("update-plants")
    plant.data.name = newName
    plant.data.nameStatus = newStatus
    console.log("UPDATE HERE")
    console.log(plant)
    console.log(plant.id)
    const updateRequest = plantStore.put({data: plant.data}, {id: plant.id})
    updateRequest.addEventListener("success", () => {
        console.log("Updated " + plant.id)
    })
}

function openPlantsIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("plants", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore('plants', {keyPath: '_id'});
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}

function openSyncPlantsIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("sync-plants", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore('sync-plants', {keyPath: 'id', autoIncrement: true});
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}

function openUpdatePlantsIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("update-plants", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore('update-plants', {keyPath: 'id', autoIncrement: true});
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}


