var express = require('express');
var bodyParser = require('body-parser');
var {
    ObjectID
} = require("mongodb");
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
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send(`ID is not valid ${req.params.id}`);
    }
    var todos = Todo.findById(req.params.id).then(todo => {
        if (!todo) {
            return res.status(404).send(`Can't find Id ${req.params.id}`);
        }
        res.send({
            "todo": todo,
            "params": req.params

        })
    }).catch(e => {
        res.send({
            e
        })
    });
});

app.listen(3000, () => {
    console.log("Started on port 3000");
});

module.exports = {
    app
};