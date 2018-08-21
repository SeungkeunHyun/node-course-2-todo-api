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
const _ = require('lodash');

var {
    Todo
} = require("./models/todo");
var {
    User
} = require("./models/user");
var {
    authenticate
} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;
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

// POST /users
app.post("/users", (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    //User.findByToken()
    //User.generateAuthToken();
    user.save().then(userDoc => {
            return userDoc.generateAuthToken();
        }).then(token => res.header("x-auth", token).send(user))
        .catch(e => {
            res.status(400).send(e);
        });
});



app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
};