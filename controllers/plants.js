const plantModel = require('../models/plants');

exports.create = function (plantData, filePath) {

    // create a new plant instance using the provided plant data
    let plant = new plantModel( {
        name: plantData.name,
        nameStatus: plantData.nameStatus,
        description: plantData.description,

        img: filePath,
        
        height: plantData.height,
        spread: plantData.spread,

        leaves: plantData.leaves,
        flowers: plantData.flowers,
        flowerColour: plantData.flowerColour,
        
        fruitSeeds: plantData.fruitSeeds,
        sunExposure: plantData.sunExposure,
        
        location: plantData.location,
        dateOfSighting: plantData.dateOfSighting,
        nickname: plantData.nickname,
    });

    // save the plant to the database and handle success/failure
    return plant.save()
        .then(plant => {
        console.log(plant);
        return JSON.stringify(plant);
    }).catch(err => {
        console.log("Failed to save data")
        console.log(err);
        return null;
    });
};

// get all plants
exports.getAll = function () {
    return plantModel.find({})
        .then(plants => {
        // return the list of plants as a JSON string
        return JSON.stringify(plants);
    }).catch(err => {
        console.log("Failed to get all", err);
        return null;
    });
};