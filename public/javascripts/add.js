const fileInput = document.getElementById("image")
const reader = new FileReader();
var imageSave = ""
var file

fileInput.addEventListener("change", e => {
    file = fileInput.files[0];
    if(file.size>2097152) {
        //TODO make this look nice
        console.log(file)
        alert("file too big");
        this.value=""
    }

    reader.addEventListener("load", () => {
        console.log(reader.result)
        imageSave = reader.result
    })
    reader.readAsDataURL(file)
})

const addNewPlantButtonEventListener = () => {
    console.log("ADD NEW PLANT")

    var plant = {
        _id: "sync",
        name: document.getElementById("name").value,
        nameStatus: document.getElementById("nameStatus").value,
        description: document.getElementById("description").value,
        img: imageSave,
        height: document.getElementById("height").value,
        spread: document.getElementById("spread").value,
        leaves: document.getElementById("leaves").value,
        flowers: document.getElementById("flowers").value,
        flowerColour: document.getElementById("flowerColour").value,
        fruitSeeds: document.getElementById("fruitSeeds").value,
        sunExposure: document.getElementById("sunExposure").value,
        location: document.getElementById("location").value,
        dateOfSighting: document.getElementById("dateOfSighting").value,
        username: document.getElementById("username").value,
        suggestedNames: []
    }
    openSyncPlantsIDB().then((db) => {
        addNewPlantToSync(db, plant);
    });

    navigator.serviceWorker.ready
        .then(function (serviceWorkerRegistration) {
            serviceWorkerRegistration.showNotification("Plant Registration",
                {body: "Plant added! - " + plant.name})
                .then(r =>
                    console.log("Notification Response")
                )
        });
}

window.onload = function () {
    // Add event listeners to buttons
    console.log("BUTTON EVENT LISTENER SET")
    const add_btn = document.getElementById("add_btn")
    add_btn.addEventListener("click", addNewPlantButtonEventListener)
}