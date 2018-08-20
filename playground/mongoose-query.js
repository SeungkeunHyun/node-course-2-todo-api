const {
    ObjectID
} = require('mongodb');
const {
    mongoose
} = require('./../server/db/mongoose');
const {
    User
} = require("./../server/models/user");

var id = "5b7a41954473924a54ad8d27";

User.findById(id).then(user => console.log("User by Id", user));

User.findOne({
    _id: id
}).then(user => console.log("User", user));

User.find({
    _id: id
}).then(users => console.log("Users", users));

User.find({
    email: "sk-hyun@outlook.kr"
}).then(users => console.log("Users by email", users));
/*
const {
    Todo
} = require('./../server/models/todo');

var id = "5b7a575517cbf437dc279715aaa";

if (!ObjectID.isValid(id)) {
    return console.error('ID is not valid', id);
}

Todo.find({
    _id: id
}).then(todos => console.log("Todos", todos));

Todo.findOne({
    _id: id
}).then(todo => console.log("Todo", todo));

var nid = new ObjectID();
Todo.findById(nid).then(todo => todo ? console.log("Todo by Id", todo) : console.log(`Id not found: ${nid}`))
    .catch(e => console.error(e));

    */