const mongoose = require('mongoose');

// database name here
const mongoDB = 'mongodb://localhost:27017/plants';
let connection;

mongoose.Promise = global.Promise;

// connect to the mongoDB server
mongoose.connect(mongoDB)
    .then(result => {
    connection = result.connection;
    console.log("Connection Successful!");
}).catch(err => {
    console.log("Connection Failed!", err);
});