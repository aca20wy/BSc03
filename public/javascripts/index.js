// Function to insert a plant item into the list

const insertPlantInList = (plant) => {
    console.log("INSERT PLANT")
    if (plant._id !== null && plant._id !== undefined) {
        const copy = document.getElementById("plant_template").cloneNode(true)
        copy.removeAttribute("id")
        // console.log(copy.childNodes)// otherwise this will be hidden as well
        copy.childNodes.item(1).childNodes.item(1).id = plant._id //href plant page link plant-card
        copy.childNodes.item(1).childNodes.item(1).childNodes.item(1).src =  plant.img //image
        copy.childNodes.item(1).childNodes.item(1).childNodes.item(1).alt = "Image of " + plant.name //image alt text
        //copy.childNodes.item(1).childNodes.item(3).childNodes.item(1).childNodes.item(1).href = "/plant/"+plant._id //href card-body
        copy.childNodes.item(1).childNodes.item(3).childNodes.item(1).childNodes.item(1).textContent = plant.name //plant card name

        // Insert sorted on string text order - ignoring case
        const plantList = document.getElementById("plant_list")
        copy.addEventListener('click', (event) => {
            window.location.href = "/plant"
            localStorage.setItem('viewing_plant',copy.childNodes.item(1).childNodes.item(1).id)
            console.log("Plant id = "+copy.childNodes.item(1).childNodes.item(1).id)
        });
        plantList.appendChild(copy) //ADDS child at the end TODO default sort?
    }
}

const insertSyncPlantInList = (plant) => {
    console.log("INSERT SYNC PLANT")
    if (plant.data._id !== null && plant.data._id !== undefined) {
        const copy = document.getElementById("plant_template").cloneNode(true)
        copy.removeAttribute("id")
        copy.childNodes.item(1).childNodes.item(1).id = plant.id //href plant page link plant-card
        copy.childNodes.item(1).childNodes.item(1).childNodes.item(1).src =  plant.data.img //image
        copy.childNodes.item(1).childNodes.item(1).childNodes.item(1).alt = "Image of " + plant.data.name //image alt text
        //copy.childNodes.item(1).childNodes.item(3).childNodes.item(1).childNodes.item(1).href = "/plant/"+plant.data._id //href card-body
        copy.childNodes.item(1).childNodes.item(3).childNodes.item(1).childNodes.item(1).textContent = plant.data.name+" (Unsynced)" //plant card name
        console.log("Sync Plant id = "+copy.childNodes.item(1).childNodes.item(1).id)
        // Insert sorted on string text order - ignoring case
        const plantList = document.getElementById("plant_list")
        copy.addEventListener('click', (event) => {
            window.location.href = "/plant"
            localStorage.setItem('viewing_plant',copy.childNodes.item(1).childNodes.item(1).id)

        });
        plantList.appendChild(copy) //ADDS child at the end TODO default sort?

    }
}

const insertUpdatePlantInList = (plant) => {
    console.log("INSERT UPDATE PLANT")
    if (plant.data._id !== null && plant.data._id !== undefined) {
        const copy = document.getElementById("plant_template").cloneNode(true)
        copy.removeAttribute("id")
        copy.childNodes.item(1).childNodes.item(1).id = plant.id //href plant page link plant-card
        copy.childNodes.item(1).childNodes.item(1).childNodes.item(1).src =  plant.data.img //image
        copy.childNodes.item(1).childNodes.item(1).childNodes.item(1).alt = "Image of " + plant.data.name //image alt text
        //copy.childNodes.item(1).childNodes.item(3).childNodes.item(1).childNodes.item(1).href = "/plant/"+plant.data._id //href card-body
        copy.childNodes.item(1).childNodes.item(3).childNodes.item(1).childNodes.item(1).textContent = plant.data.name+" (Pending Update)" //plant card name
        console.log("Update Plant id = "+copy.childNodes.item(1).childNodes.item(1).id)
        // Insert sorted on string text order - ignoring case
        const plantList = document.getElementById("plant_list")
        copy.addEventListener('click', (event) => {
            window.location.href = "/plant"
            localStorage.setItem('viewing_plant',copy.childNodes.item(1).childNodes.item(1).id)

        });
        plantList.appendChild(copy) //ADDS child at the end TODO default sort?

    }
}

// Register service worker to control making site work offline
window.onload = function () {
    console.log("REGISTER SERVICE WORKER")
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', {scope: '/'})
            .then(function (reg) {
                console.log('Service Worker Registered!', reg);
            })
            .catch(function (err) {
                console.log('Service Worker registration failed: ', err);
            });
    }

    // Check if the browser supports the Notification API
    if ("Notification" in window) {
        // Check if the user has granted permission to receive notifications
        if (Notification.permission === "granted") {
            // Notifications are allowed, you can proceed to create notifications
            // Or do whatever you need to do with notifications
        } else if (Notification.permission !== "denied") {
            // If the user hasn't been asked yet or has previously denied permission,
            // you can request permission from the user
            Notification.requestPermission().then(function (permission) {
                // If the user grants permission, you can proceed to create notifications
                if (permission === "granted") {
                    navigator.serviceWorker.ready
                        .then(function (serviceWorkerRegistration) {
                            serviceWorkerRegistration.showNotification("Plant App",
                                {body: "Notifications are enabled!"})
                                .then(r =>
                                    console.log(r)
                                );
                        });
                }
            });
        }
    }

    if (navigator.onLine) {
        console.log("Online mode")
        navigator.serviceWorker.ready.then((sw) => {
            sw.sync.register("sync-plant")
            sw.sync.register("update-plant")

        }).then(() => {
            fetch('http://localhost:3000/plants')
                .then(function (res) {
                    return res.json();
                }).then(function (newPlants) {
                openPlantsIDB().then((db) => {
                    insertPlantInList(db, newPlants)
                    deleteAllExistingPlantsFromIDB(db).then(() => {
                        addNewPlantsToIDB(db, newPlants).then(() => {
                            console.log("All new plants added to IDB")
                        })
                    });
                });
            }).catch(() => console.log("Going Offline")).then(function () {
                console.log("HERE")
                openPlantsIDB().then((db) => {
                    console.log("HERE 2")
                    getAllPlants(db).then((plants) => {
                        console.log("HERE 3")
                        for (const plant of plants) {
                            insertPlantInList(plant)
                        }
                    });
                });
                openSyncPlantsIDB().then((db) => {
                    getAllSyncPlants(db).then((sync_plants) => {
                        for (const sync_plant of sync_plants) {
                            insertSyncPlantInList(sync_plant)
                        }
                    });
                });
                openUpdatePlantsIDB().then((db) => {
                    getAllUpdatePlants(db).then((update_plants) => {
                        for (const update_plant of update_plants) {
                            insertUpdatePlantInList(update_plant)
                        }
                    });
                });
            })
        })


    } else {
        console.log("Offline mode")
        openPlantsIDB().then((db) => {
            getAllPlants(db).then((plants) => {
                for (const plant of plants) {
                    insertPlantInList(plant)
                }
            });

        });
        openSyncPlantsIDB().then((db) => {
            getAllSyncPlants(db).then((sync_plants) => {
                for (const sync_plant of sync_plants) {
                    insertSyncPlantInList(sync_plant)
                }
            });
        });
        openUpdatePlantsIDB().then((db) => {
            getAllUpdatePlants(db).then((update_plants) => {
                for (const update_plant of update_plants) {
                    insertUpdatePlantInList(update_plant)
                }
            });
        });

    }
}

