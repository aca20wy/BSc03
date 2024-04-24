let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PlantSchema = new Schema(
    {
        name: {type: String, required: true, max: 100},
        nameStatus: {type: String, required: true, max: 25},
        description: {type: String, required: true, max: 500},

        img: {type: String},

        height: {type: Number, required: true},
        spread: {type: Number, required: true},

        leaves: {type: String, required: true, max: 100},
        flowers: {type: String, required: true, max: 100},
        flowerColour: {type: String, required: false, max: 100},

        fruitSeeds: {type: String, required: true, max: 25},
        sunExposure: {type: String, required: true, max: 25},

        location: {type: String, required: true, max: 250},
        dateOfSighting: {type: Date},
        nickname: {type: String, required: true, max: 100},
    }
);

PlantSchema.set('toObject', { getters: true, virtuals: true });

// Create the mongoose model 'Plant' based on the defined schema
let Plant = mongoose.model('plant', PlantSchema);

module.exports = Plant;