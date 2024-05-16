var express = require('express');
var router = express.Router();
var plantsController  = require('../controllers/plants');
var Plant = require('../models/plants');

router.get('/:id', function(req, res) {
  let plantId = req.params.id;
  Plant.findById(plantId)
      .then(plantDetails => {
          if (!plantDetails) {
              return res.status(404).send('Plant not found');
          }
          console.log(plantDetails.img);
          res.render('plant', { plant: plantDetails });
      })
      .catch(err => {
          console.error(err);
          res.status(500).send(err.message);
      });
});

router.post('/:id', function(req, res){
    let plantId = req.body.id;
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

module.exports = router;