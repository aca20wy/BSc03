var express = require('express');
var router = express.Router();
var plantsController = require('../controllers/plants');

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads/');
  },
  filename: function (req, file, cb) {
    var original = file.originalname;
    var fileExtension = original.split(".");
    filename = Date.now() + '.' + fileExtension[fileExtension.length-1];
    cb(null, filename);
  }
});
let upload = multer({storage: storage});


router.get('/', function(req, res, next) {
  res.render('add', { title: 'New Plant Form' });
  console.log("add page")
});

router.post('/', upload.single('img'), function (req, res, next) {
  let plantData = req.body;
  let filePath = req.file.path;
  console.log("test")
  let result = plantsController.create(plantData, filePath);
  console.log(plantData);
  console.log(result);
  res.redirect('/');
});

module.exports = router;
