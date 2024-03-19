var express = require('express');
var router = express.Router();
let plants = require('../controllers/plants')

let multer = require('multer');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads/');
  },
  filename: function (req, file, cb) {
    let original = file.originalname;
    let file_extension = original.split(".");
    filename = Date.now() + '.' + file_extension[file_extension.length-1];
    cb(null, filename);
  }
});
let upload = multer({storage: storage});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'New Plant Form' });
});

router.post('/add', upload.single('myImg'), function (req, res, next) {
  let plantData = req.body;
  let filePath = req.file.path;
  let result = plants.create(plantData, filePath);
  console.log(result);
  res.redirect('/');
});

router.get('/display', function(req, res, next) {
  let result = plants.getAll();
  result.then(plants => {
    let data = JSON.parse(plants);
    console.log(data.length);
    res.render('display', {title: 'View All Plants', data: data});
  });
});

module.exports = router;
