const plantModel = require('../models/plants');

exports.create = function (plantData, filePath) {
    let plant = new plantModel( {
        nickname: plantData.nickname,
        plantName: plantData.plantName,
        plantNameStatus: plantData.plantNameStatus,
        description: plantData.description,
        height: plantData.height,
        spread: plantData.spread,
        flowers: plantData.flowers,
        flowerColour: plantData.flowerColour,
        leaves: plantData.leaves,
        fruitSeeds: plantData.fruitSeeds,
        sunExposure: plantData.sunExposure,
        location: plantData.location,
        dateOfSighting: plantData.dateOfSighting,
        image: filePath,
    });

    return plant.save().then(plant => {
        console.log(plant);

        return JSON.stringify(plant);
    }).catch(err => {
        console.log(err);

        return null;
    });
};

exports.getAll = function () {
    return plantModel.find({}).then(plants => {
        return JSON.stringify(plants);
    }).catch(err => {
        return null;
    });
};