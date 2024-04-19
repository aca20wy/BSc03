var express = require('express');
var router = express.Router();
var posts = require('../controllers/posts');

/* GET home page. */
router.get('/', function (req, res, next) {
    let result = posts.getAll();
    result.then(posts => {
        let data = JSON.parse(posts);
        console.log(data);
        res.render('index', {title: 'View All Plants', data: data});
    });
});

module.exports = router;