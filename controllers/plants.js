const plantModel = require('../models/plants');

exports.create = function (userData, filePath) {
    let plant = new plantModel( {
        first_name: userData.first_name,
        last_name: userData.last_name,
        dob: userData.dob,
        img: filePath,
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