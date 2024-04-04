var express = require('express');
var router = express.Router();
let posts = require('../controllers/posts')

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

router.post('/add', upload.single('img'), function (req, res, next) {
  let postData = req.body;
  let filePath = req.file.path;
  let result = posts.create(postData, filePath);
  console.log(result);
  res.redirect('/');
});

router.get('/display', function(req, res, next) {
  let result = posts.getAll();
  result.then(posts => {
    let data = JSON.parse(posts);
    console.log(data.length);
    res.render('display', {title: 'View All Plants', data: data});
  });
});

module.exports = router;
