let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PostSchema = new Schema(
    {
        name: {type: String, required: true, max: 100},
        name_status: {type: String, required: true, max: 25},
        description: {type: String, required: true, max: 500},

        img: {type: String},

        height: {type: Number, required: true},
        spread: {type: Number, required: true},

        leaves: {type: String, required: true, max: 100},
        flowers: {type: String, required: true, max: 100},
        flower_colour: {type: String, required: false, max: 100},

        fruit_seeds: {type: String, required: true, max: 25},
        sun_exposure: {type: String, required: true, max: 25},

        location: {type: String, required: true, max: 250},
        date_of_sighting: {type: Date},
        nickname: {type: String, required: true, max: 100},
    }
);

PostSchema.set('toObject', {getters: true, virtuals: true});

let Post = mongoose.model('post', PostSchema);

module.exports = Post;