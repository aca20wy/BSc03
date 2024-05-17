// Function to insert a plant item into the list

const insertPlantInList = (plant) => {
    console.log("INSERT PLANT")
    if (plant._id !== null && plant._id !== undefined) {
        const copy = document.getElementById("plant_template").cloneNode(true)
        copy.removeAttribute("id")
        copy.style.display = "block"

        copy.childNodes.item(1).childNodes.item(1).id = plant._id //href plant page link plant-card
        copy.childNodes.item(1).childNodes.item(1).childNodes.item(1).src =  plant.img //image
        copy.childNodes.item(1).childNodes.item(1).childNodes.item(1).alt = "Image of " + plant.name //image alt text
        copy.childNodes.item(1).childNodes.item(3).childNodes.item(1).childNodes.item(1).textContent = plant.name //plant card name
        copy.childNodes.item(1).childNodes.item(3).childNodes.item(3).textContent = plant.nameStatus;
        copy.childNodes.item(1).childNodes.item(3).childNodes.item(5).textContent = plant.leaves;
        copy.childNodes.item(1).childNodes.item(3).childNodes.item(7).textContent = plant.flowers;
        copy.childNodes.item(1).childNodes.item(3).childNodes.item(9).textContent = plant.fruitSeeds;
        copy.childNodes.item(1).childNodes.item(3).childNodes.item(11).textContent = plant.sunExposure;

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

// gets the necessary information based on which filter changes and to what value it changes to
function filterPlantList(filter) {
    let val
    switch (filter) {
        case 'nameSts':
            val = document.getElementById("nameFil").value
            switch (val) {
                case "0":
                    showPlant(3, val)
                    break;
                case "Completed":
                    showPlant(3, val)
                    break;
                case "In-progress":
                    showPlant(3, val)
                    break;
            }
            break;
        case 'leave':
            val = document.getElementById("leaveFil").value
            switch (val) {
                case "0":
                    showPlant(5, val)
                    break;
                case "Yes":
                    showPlant(5, val)
                    break;
                case "No":
                    showPlant(5, val)
                    break;
            }
            break;
        case 'flower':
            val = document.getElementById("flowerFil").value
            switch (val) {
                case "0":
                    showPlant(7, val)
                    break;
                case "Yes":
                    showPlant(7, val)
                    break;
                case "No":
                    showPlant(7, val)
                    break;
            }
            break;
        case 'fruSee':
            val = document.getElementById("fruSeeFil").value
            switch (val) {
                case "0":
                    showPlant(9, val)
                    break;
                case "None":
                    showPlant(9, val)
                    break;
                case "Fruit":
                    showPlant(9, val)
                    break;
                case "Seeds":
                    showPlant(9, val)
                    break;
            }
            break;
        case 'sunExp':
            val = document.getElementById("SunFil").value
            switch (val) {
                case "0":
                    showPlant(11, val)
                    break;
                case "Full Sun":
                    showPlant(11, val)
                    break;
                case "Partial Sun / Shade":
                    showPlant(11, val)
                    break;
                case "Full Shade":
                    showPlant(11, val)
                    break;
            }
            break;
    }
}

// filters plants on home page based on filters
function showPlant(filterIndex, value) {
    let plantList = document.getElementById("plant_list")
    let currentPlant
    let filterSpan;

    for (let i = 3; i < plantList.childNodes.length; i++) {
        currentPlant = plantList.childNodes.item(i);
        filterSpan = currentPlant.childNodes.item(1).childNodes.item(3).childNodes.item(filterIndex)

        if (currentPlant.style.display == "block") {
            if (filterSpan.textContent != value && value != 0) {
                currentPlant.style.display = "none";
            } else if (value == 0) {
                currentPlant.style.display = "block";
            }
        } else if (currentPlant.style.display == "none") {
            if (value == 0) {
                currentPlant.style.display = "block";
            }
        }
    }
}

// Shows all plants on home page and resets the filters
function showAllPlants() {
    let plantList = document.getElementById("plant_list")

    for (let i = 3; i < plantList.childNodes.length; i++) {
        let currentPlant = plantList.childNodes.item(i);
        currentPlant.style.display = "block"
    }
    document.getElementById("nameFil").value = 0
    document.getElementById("leaveFil").value = 0
    document.getElementById("flowerFil").value = 0
    document.getElementById("fruSeeFil").value = 0
    document.getElementById("sunFil").value = 0
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
            })
        })
    } else
    {
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

    }
}

