var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var mongooseCallback = (doc) => console.log("Saved document", JSON.stringify(doc, undefined, 2));

var mongooseCallbackErr = (err) => console.log("Failed to save document", JSON.stringify(err, undefined, 2));

mongoose.connect("mongodb://localhost:27017/TodoApp", {
    useNewUrlParser: true
});

module.exports = {
    mongoose,
    mongooseCallback,
    mongooseCallbackErr
};