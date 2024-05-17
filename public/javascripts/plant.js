//Register service worker to control making site work offline
window.onload = function () {
    console.log("PLANT PAGE LOAD")
    if(localStorage.getItem('viewing_plant').length === 24)
    {
        openPlantsIDB().then((db) => {
            getPlant(localStorage.getItem('viewing_plant'), db).then((plant) => {
                insertPlantDetails(plant)
                console.log("normal view success")
            })
        })
    }
    else
    {
        openSyncPlantsIDB().then((db) => {
            getSyncPlant(Number(localStorage.getItem('viewing_plant')), db).then((plant) => {
                insertPlantDetails(plant)
                console.log("sync view success")
            })
        })
    }
}

function DBPedia() {
    try{
        // The DBPedia SPARQL endpoint URL
        const endpointUrl = 'https://dbpedia.org/sparql';

        const name = document.getElementById("plant_name").textContent

        const sparqlQuery = `
        SELECT DISTINCT ?resource
        WHERE {
          ?resource rdfs:label ?label .
          FILTER (langMatches(lang(?label), "en"))
          FILTER regex(?label, "${name}", "i")
        }
        LIMIT 5
        `;

    // Encode the query as a URL parameter
        const encodedQuery = encodeURIComponent(sparqlQuery);

    // Build the URL for the SPARQL query
        const url = `${endpointUrl}?query=${encodedQuery}&format=json`;

    // Fetch the data from the SPARQL endpoint
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // The results are in the 'data' object
                let bindings = data.results.bindings;
                let result = JSON.stringify(bindings);

                bindings.forEach((binding) => {
                    if (binding.resource.value != null || binding.resource.value == "") {
                        let option = document.createElement("li");
                        let link = document.createElement("a")
                        link.href = binding.resource.value;
                        link.text = binding.resource.value;
                        // let optionText = document.createTextNode(binding.resource.value);
                        option.appendChild(link);
                        document.getElementById("dbpedia").appendChild(option);
                    }
                });

                if (bindings.length == 0) {
                    let label = document.getElementById("dbpediaLabel")
                    label.textContent = " None found";
                }
            });
    }catch (err) {
        console.log("DBPedia unavailable")
    }

}

const insertPlantDetails = (plant) => {
    console.log("INSERT PLANT DETAILS")
    console.log(plant)
    if (plant._id !== null && plant._id !== undefined) {
        const colour = plant.flowerColour

        document.getElementById("plant_title").innerText = plant.name
        document.getElementById("plant_name").innerText = plant.name
        document.getElementById("plant_name").setAttribute("data-original-value",plant.name)
        document.getElementById("plant_nameStatus").innerText = plant.nameStatus
        document.getElementById("plant_nameStatus").setAttribute("data-original-value",plant.nameStatus)
        document.getElementById("plant_image").src = plant.img
        document.getElementById("plant_date").innerHTML = "<strong>Date and Time Seen:</strong> "+plant.dateOfSighting.substring(0,10)
        document.getElementById("plant_description").innerHTML = "<strong>Description:</strong> "+plant.description
        document.getElementById("plant_height").innerHTML = "<strong>Height:</strong> "+plant.height+"cm"
        document.getElementById("plant_spread").innerHTML = "<strong>Spread:</strong> "+plant.spread+"cm"
        document.getElementById("plant_leaves").innerHTML = "<strong>Leaves:</strong> "+plant.leaves
        document.getElementById("plant_flowers").innerHTML = "<strong>Flowers:</strong> "+plant.flowers
        document.getElementById("plant_flower_colours").style = "background-color:"+plant.flowerColour+"; color:"+plant.flowerColour+";"
        document.getElementById("plant_flower_colours").textContent = plant.flowerColour
        document.getElementById("plant_flower_rgb").textContent = plant.flowerColour
        document.getElementById("plant_fruit_seeds").innerHTML = "<strong>Fruit Seeds:</strong> "+plant.fruitSeeds
        document.getElementById("plant_sun_exposure").innerHTML = "<strong>Sun Exposure:</strong> "+plant.sunExposure
        document.getElementById("plant_location").innerHTML = "<strong>Location:</strong> "+plant.location
        document.getElementById("plant_creator").innerHTML = "<strong>Original Poster:</strong> "+plant.username
        const chatList = document.getElementById("chatHistory");

        console.log(plant.chats)

        //CHAT
        for(let i = 0; i<plant.chats.length; i++)
        {
            let chat_template = document.getElementById("chat_template").cloneNode(true);
            chat_template.removeAttribute("id")
            chat_template.innerHTML = "<strong>"+plant.chats[i].chatUsername+":</strong> "+plant.chats[i].chatText
            chatList.appendChild(chat_template)
        }

        console.log("CHECK CHAT IDB")

        openChatIDB().then((chatIDB) => {
            getPendingChats(chatIDB).then((pendingChats) => {
                console.log(pendingChats)
                console.log(pendingChats.length)
                for(let i = 0; i<pendingChats.length; i++)
                {
                    console.log("CHAT IN IDB")
                    console.log(pendingChats[i])
                    console.log(localStorage.getItem("viewing_plant"))
                    console.log(pendingChats[i].data.plantId)
                    if(pendingChats[i].data.plantId == localStorage.getItem("viewing_plant"))
                    {

                        let chat_template = document.getElementById("chat_template").cloneNode(true);
                        chat_template.removeAttribute("id")
                        chat_template.innerHTML = "<strong>"+pendingChats[i].data.chatUsername+":</strong> "+pendingChats[i].data.chatText
                        chatList.appendChild(chat_template)
                    }
                }
            })
        })



    }
    else
    {
        document.getElementById("plant_title").innerText = plant.data.name
        document.getElementById("plant_name").innerText = plant.data.name
        document.getElementById("plant_status").innerText = "(Unsynced)"

        document.getElementById("plant_name").setAttribute("data-original-value",plant.data.name)
        document.getElementById("plant_nameStatus").innerText = plant.data.nameStatus
        document.getElementById("plant_nameStatus").setAttribute("data-original-value",plant.data.nameStatus)
        document.getElementById("plant_image").src = plant.data.img
        document.getElementById("plant_date").innerHTML = "<strong>Date and Time Seen:</strong> "+plant.data.dateOfSighting.substring(0,10)
        document.getElementById("plant_description").innerHTML = "<strong>Description:</strong> "+plant.data.description
        document.getElementById("plant_height").innerHTML = "<strong>Height:</strong> "+plant.data.height+"cm"
        document.getElementById("plant_spread").innerHTML = "<strong>Spread:</strong> "+plant.data.spread+"cm"
        document.getElementById("plant_leaves").innerHTML = "<strong>Leaves:</strong> "+plant.data.leaves
        document.getElementById("plant_flowers").innerHTML = "<strong>Flowers:</strong> "+plant.data.flowers
        document.getElementById("plant_flower_colours").style = "background-color:"+plant.flowerColour+"; color:"+plant.flowerColour+";"
        document.getElementById("plant_flower_colours").textContent = plant.flowerColour
        document.getElementById("plant_flower_rgb").textContent = plant.flowerColour
        document.getElementById("plant_fruit_seeds").innerHTML = "<strong>Fruit Seeds:</strong> "+plant.data.fruitSeeds
        document.getElementById("plant_sun_exposure").innerHTML = "<strong>Sun Exposure:</strong> "+plant.data.sunExposure
        document.getElementById("plant_location").innerHTML = "<strong>Location:</strong> "+plant.data.location
        document.getElementById("plant_creator").innerHTML = "<strong>Original Poster:</strong> "+plant.data.username

        //THEN CHAT
        const chatList = document.getElementById("chatHistory");

        //CHAT
        for(const chat in plant.data.chats)
        {
            console.log(chat)
            let chat_template = document.getElementById("chat_template").cloneNode(true);
            chat_template.innerHTML = "<strong>"+chat.chatUsername+":</strong> "+chat.chatText
            chatList.appendChild(chat_template)
        }

        console.log("CHECK CHAT IDB")

        openSyncChatIDB().then((chatIDB) => {
            getPendingSyncChats(chatIDB).then((pendingChats) => {
                console.log(pendingChats)
                console.log(pendingChats.length)
                for(let i = 0; i<pendingChats.length; i++)
                {
                    console.log("CHAT IN IDB")
                    console.log(pendingChats[i])
                    console.log(localStorage.getItem("viewing_plant"))
                    console.log(pendingChats[i].data.plantId)
                    if(pendingChats[i].data.plantId == localStorage.getItem("viewing_plant"))
                    {

                        let chat_template = document.getElementById("chat_template").cloneNode(true);
                        chat_template.removeAttribute("id")
                        chat_template.innerHTML = "<strong>"+pendingChats[i].data.chatUsername+":</strong> "+pendingChats[i].data.chatText
                        chatList.appendChild(chat_template)
                    }
                }
            })
        })
    }
    addEditListeners()
    DBPedia()
}

function addEditListeners() {
    const originalUser = document.getElementById('plant_creator').innerText.substring(17);
    console.log(originalUser)
    const currentUser = localStorage.getItem('username');
    const plantStatus = document.getElementById('plant_nameStatus').innerText;

    if (plantStatus === 'In-progress') {
        if (currentUser === originalUser) {
            // Show edit button only to the original user and if the status is in-progress
            document.getElementById('editButton').style.display = 'block';
        }
    } else {
        // If status is complete, disable chat
        document.getElementById('chatForm').style.display = 'None';
    }

    document.getElementById('editButton').addEventListener('click', toggleEditMode);
    document.getElementById('saveChangesButton').addEventListener('click', saveChanges);
    document.getElementById('cancelChangesButton').addEventListener('click', cancelChanges);
}

function toggleEditMode() {
    const nameField = document.getElementById('plant_name');
    const statusField = document.getElementById('plant_nameStatus');
    const editButton = document.getElementById('editButton');
    const saveCancelButtons = document.getElementById('saveCancelButtons');

    const isEditing = editButton.style.display === 'none';

    if (isEditing) {
        // Switch back to view mode
        const nameInput = document.getElementById('nameInput');
        const statusSelect = document.getElementById('statusSelect');

        if (nameInput && statusSelect) {
            nameField.innerText = nameInput.value;
            statusField.innerText = statusSelect.value;

            // Show edit button again if the status is still in-progress
            if(statusSelect.value === "In-progress") {
                editButton.style.display = "block";
            } else {
                // If status is complete, disable chat
                document.getElementById('chatForm').style.display = 'None';
            }
        } else {
            console.error('Input fields not found when switching back to view mode');
        }
        saveCancelButtons.style.display = 'none';
    } else {
        // Switch to edit mode
        nameField.innerHTML = `<input type="text" id="nameInput" class="form-control" value="${nameField.getAttribute('data-original-value')}">`;
        statusField.innerHTML = `
            <select id="statusSelect" class="form-control">
                <option value="In-progress" ${statusField.getAttribute('data-original-value') === 'In-progress' ? 'selected' : ''}>In-progress</option>
                <option value="Completed" ${statusField.getAttribute('data-original-value') === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
        `;
        editButton.style.display = 'none';
        saveCancelButtons.style.display = 'block';
    }
}

function saveChanges() {
    const plantId = localStorage.getItem("viewing_plant")
    const newName = document.getElementById('nameInput').value;
    const newStatus = document.getElementById('statusSelect').value;

    console.log('Sending update request:', { name: newName, nameStatus: newStatus });

    if(newName === "")
    {
        alert("The new plant name cannot be empty")
    }
    else if(newName === document.getElementById('plant_name').getAttribute('data-original-value')
        && newName === document.getElementById('plant_nameStatus').getAttribute('data-original-value'))
    {
        cancelChanges()
    }
    else
    {
        openSyncPlantsIDB().then((db) => {
            console.log(db)
            getSyncPlant(Number(plantId), db).then((plant) => {
                console.log("HERE")
                console.log(plantId)
                console.log("NOW PLANT")
                console.log(plant)
                updateSyncPlant(plant, newName, newStatus, db)
            }).catch(() => {
                console.log("FAILED UPDATE (TYPE SYNC)")
            });
        });
        openUpdatePlantsIDB().then((db) => {
            getUpdatePlant(plantId, db).then((plant) => {
                updateUpdatePlant(plant, newName, newStatus, db)
            }).catch(() => {
                console.log("FAILED UPDATE (TYPE UPDATE)")
            });
        });
        openPlantsIDB().then((plantDb) => {
            getPlant(plantId, plantDb).then((plant) => {
                plant.name = newName
                plant.nameStatus = newStatus
                openUpdatePlantsIDB().then((updateDb) => {
                    deletePlantFromIDB(plantDb, plant._id)
                    addNewPlantToUpdate(updateDb, plant).then(() => {
                        console.log("Plant Updated!")
                        fetch('http://localhost:3000/plants')
                            .then(function (res) {
                                return res.json();
                            }).then(function (newPlants) {
                                console.log("HERE")
                                openPlantsIDB().then((db) => {
                                    deleteAllExistingPlantsFromIDB(db).then(() => {
                                        addNewPlantsToIDBFromView(db, newPlants).then(() => {
                                            console.log("All new plants added to IDB")
                                        })
                                    });
                                });
                            })
                    })
                })


            }).catch(() => {
                console.log("FAILED UPDATE (TYPE PLANT)")
            })
        });

        document.getElementById('plant_name').setAttribute('data-original-value', newName);
        document.getElementById('plant_nameStatus').setAttribute('data-original-value', newStatus);
        toggleEditMode(); // Switch back to view mode with updated values
    }
}

function cancelChanges() {
    const nameField = document.getElementById('plant_name');
    const statusField = document.getElementById('plant_nameStatus');
    nameField.innerHTML = nameField.getAttribute('data-original-value');
    statusField.innerHTML = statusField.getAttribute('data-original-value');
    document.getElementById('editButton').style.display = 'block';
    document.getElementById('saveCancelButtons').style.display = 'none';
}

