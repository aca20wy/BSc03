var express = require('express');
var router = express.Router();
var plantsController = require('../controllers/plants');

/* GET home page. */
router.get('/', function (req, res, next) {
    let result = plantsController.getAll();
    result.then(plants => {
        let data = JSON.parse(plants);
        console.log(data);
        res.render('index', {title: 'View All Plants', data: data});
    });
});

module.exports = router;