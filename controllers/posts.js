const postModel = require('../models/posts');

exports.create = function (postData, filePath) {

    let post = new postModel( {
        name: postData.name,
        name_status: postData.name_status,
        description: postData.description,

        img: filePath,
        
        height: postData.height,
        spread: postData.spread,

        leaves: postData.leaves,
        flowers: postData.flowers,
        flower_colour: postData.flower_colour,
        
        fruit_seeds: postData.fruit_seeds,
        sun_exposure: postData.sun_exposure,
        
        location: postData.location,
        date_of_sighting: postData.date_of_sighting,
        nickname: postData.nickname,
    });

    return post.save().then(post => {
        console.log(post);

        return JSON.stringify(post);
    }).catch(err => {
        console.log("data error")
        console.log(err);

        return null;
    });
};

exports.getAll = function () {
    return postModel.find({}).then(posts => {
        return JSON.stringify(posts);
    }).catch(err => {
        return null;
    });
};