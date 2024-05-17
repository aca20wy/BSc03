const fileInput = document.getElementById("image")
const reader = new FileReader();
var imageSave = ""
var file

fileInput.addEventListener("change", e => {
    file = fileInput.files[0];
    if(file == null){
        console.log("File is null")
        alert("Plant Image is required!");
        this.value=""
    }
    if(file.size>2097152) {
        //console.log(file)
        alert("Plant Image size too large!");
        this.value=""
    }

    reader.addEventListener("load", () => {
        console.log(reader.result)
        imageSave = reader.result
    })
    reader.readAsDataURL(file)
})


const appendAlert = (message, type) => {
    let alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    let wrapper = document.createElement('div')
    alertPlaceholder.append(wrapper)
    let alert = document.getElementById('liveAlertPlaceholder').children[0];
    console.log(alert)
    alert.classList.add("alert");
    alert.classList.add(`alert-${type}`);
    alert.classList.add("alert-dismissible");
    alert.classList.add("fade");
    alert.classList.add("show");
    alert.role = "alert";
    alert.innerHTML = [
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'
    ].join('')
}

function colorPicker(){
    let flowers = document.getElementById("flowers")
    let colours = document.getElementById("flowerColour")
    colours.disabled = flowers.value != "Yes";
}

const addNewPlantButtonEventListener = () => {
    console.log("ADD NEW PLANT")
    let fColour
    if (document.getElementById("flowers").value == "Yes") {
        fColour = document.getElementById("flowerColour").value
    } else {
        fColour = "N/A"
    }

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
        flowerColour: fColour,
        fruitSeeds: document.getElementById("fruitSeeds").value,
        sunExposure: document.getElementById("sunExposure").value,
        location: document.getElementById("location").value,
        dateOfSighting: document.getElementById("dateOfSighting").value,
        username: document.getElementById("username").value,
        chat: []
    }

    if (plant.name == "" || plant.description == "" || plant.img == "" ||
        plant.location == "" || plant.dateOfSighting == "" ) {
        appendAlert('Warning: Please fill in all fields', 'warning')
    } else {
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
}

window.onload = function () {
    // Add event listeners to buttons
    console.log("BUTTON EVENT LISTENER SET")
    const add_btn = document.getElementById("add_btn")
    add_btn.addEventListener("click", addNewPlantButtonEventListener)
}