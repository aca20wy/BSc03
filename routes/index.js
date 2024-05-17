var express = require('express');
var router = express.Router();
var plantsController = require('../controllers/plants');
const Plant = require("../models/plants");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'View All Plants'})
});

router.get('/plants', function(req,res,next) {
    plantsController.getAll().then(plants => {
        return res.status(200).send(plants);
    }).catch(err => {
        console.log(err);
        res.status(500).send(err);
    })
})

router.get('/add', function(req, res,next) {
    res.render('add', {title: "New Plant Form"})
})

router.post('/add-plant', function(req, res, next) {
    console.log("Received plant: "+ req.body.name)
    let plantData = req.body;
    let filePath = plantData.img
    plantData.username = req.body.username;

    plantsController.create(plantData, filePath).then(plant => {
        res.status(200).send(plant);
    }).catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
})

router.post('/update-plant', function(req, res){
    console.log("Updating plant: "+req.body.name)
    let plantId = req.body._id;
    let updatedData = {
        name: req.body.name,
        nameStatus: req.body.nameStatus
    };
    console.log(updatedData);

    plantsController.editPlant(plantId, updatedData)
        .then(editedPlant => {
            console.log('Edited plant:', editedPlant);
            res.status(200).send(editedPlant);
        }).catch(err => {
        console.error('Error editing plant:', err);
        res.status(500).send(err);
    });
});

router.post('/update-chat', function (req,res,next) {
    let chatData = {
        chatUsername: req.body.chatUsername,
        chatText: req.body.chatText,
        chatTimeStamp: req.body.datetime,
        plantId: req.body.plantId
    };
    console.log('Chat Data: ' + chatData);
    plantsController.saveChat(chatData);
    console.log('Chat saved!');
})

router.get('/plant', function(req, res, next) {
    res.render('plant')
})

router.get('/sync-plant', function(req, res, next) {
    res.render('plant', )
})


module.exports = router;