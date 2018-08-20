var express = require('express');
var bodyParser = require('body-parser');

var {
    mongoose,
    mongooseCallback,
    mongooseCallbackErr
} = require('./db/mongoose');

var {
    Todo
} = require("./models/todo");
var {
    User
} = require("./models/user");

var app = express();
app.use(bodyParser.json());

app.post("/todos", (req, res) => {
    console.log(req.body);
    var todo = new Todo(req.body);
    todo.save().then(doc => {
        mongooseCallback(doc);
        res.send(doc);
    }, e => {
        mongooseCallbackErr(e);
        res.status(400).send(e);
    });
    console.log(todo);
});

app.get("/todos", (req, res) => {
    var todos = Todo.find({}).then(todos => res.send({
        todos
    }), (e) => res.status(400).send(e));;
});

app.get("/todos/:id", (req, res) => {
    var todos = Todo.find({
        _id: req.params.id
    }).then(todos => res.send({
        todos
    }));;
});

app.listen(3000, () => {
    console.log("Started on port 3000");
});

module.exports = {
    app
};