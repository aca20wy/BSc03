var express = require('express');
var router = express.Router();
// var plantsController  = require('../controllers/plants');
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

module.exports = router;