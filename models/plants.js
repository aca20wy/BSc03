let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PlantSchema = new Schema(
    {
        first_name: {type: String, required: true, max: 100},
        last_name: {type: String, required: true, max: 100},
        dob: {type: Date},
        img: {type: String},
    }
);

PlantSchema.set('toObject', {getters: true, virtuals: true});

let Plant = mongoose.model('plant', PlantSchema);

module.exports = Plant;