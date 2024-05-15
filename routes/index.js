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
    let filePath = plantData.img //TODO TEMP
    plantData.username = req.body.username;
    plantsController.create(plantData, filePath).then(plant => {
        res.status(200).send(plant);
    }).catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
})

// router.get("/plant/:id", function(req, res, next) {
//     let plantId = req.params.id;
//     Plant.findById(plantId)
//         .then(plantDetails => {
//             if (!plantDetails) {
//                 return res.status(404).send('Plant not found');
//             }
//             console.log(plantDetails.img);
//             res.render('plant', { plant: plantDetails });
//         })
//         .catch(err => {
//             console.error(err);
//             res.status(500).send(err.message);
//         });
//     res.render('plant');
// })

module.exports = router;