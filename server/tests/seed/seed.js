const {
    ObjectID
} = require("mongodb");
const jwt = require('jsonwebtoken');
const {
    Todo
} = require("./../../models/todo");
const {
    User
} = require("./../../models/user");


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
        _id: userOneId,
        email: "skmail1@test.com",
        password: 'userOnePass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({
                _id: userOneId.toHexString(),
                access: 'auth'
            }, process.env.JWT_SECRET).toString()
        }]
    },
    {
        _id: userTwoId,
        email: "skmail2@test.com",
        password: 'userTwoPass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({
                _id: userTwoId.toHexString(),
                access: 'auth'
            }, process.env.JWT_SECRET).toString()
        }]
    }
];
const todos = [{
        _id: new ObjectID(),
        text: "First test todo",
        _creator: userOneId
    },
    {
        _id: new ObjectID(),
        text: "Second test todo",
        completed: true,
        completedAt: 333,
        _creator: userTwoId
    }
];

const populateTodos = done => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos);
        })
        .then(() => done());
};

const populateUsers = done => {
    User.remove({})
        .then(() => {
            //return User.insertMany(users);
            var userPromises = [];
            for (var usr of users) {
                userPromises.push(new User(usr).save());
            }
            return Promise.all(userPromises);
        })
        .then(() => done());
}

module.exports = {
    todos,
    users,
    populateTodos,
    populateUsers
};