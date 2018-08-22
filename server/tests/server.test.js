const expect = require("expect");
const request = require("supertest");
const {
    ObjectID
} = require('mongodb');
const {
    app
} = require("./../server");
const {
    Todo
} = require("./../models/todo");
const {
    User
} = require("./../models/user");
const {
    todos,
    users,
    populateTodos,
    populateUsers
} = require("./seed/seed");

beforeEach(populateTodos);
beforeEach(populateUsers);

describe("Post /todos", () => {
    it("should create a new todo", done => {
        var text = "Test todo text";
        request(app)
            .post("/todos")
            .send({
                "text": text
            })
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({
                        text: text
                    })
                    .then(todos => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        return done();
                    })
                    .catch(err => done(err));
            });
    });

    it("should not create todo with invalid body data", done => {
        request(app)
            .post("/todos")
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find()
                    .then(todos => {
                        expect(todos.length).toBe(2);
                        done();
                    })
                    .catch(e => done(e));
            });
    });
});

describe("GET /todos", () => {
    it("should get list of todos", done => {
        request(app)
            .get("/todos")
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe("GET /users/me", () => {
    it("should return user if authenticated", (done) => {
        request(app)
            .get("/users/me")
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done)
    });

    it("should return 401 if not authenticated", (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'example@mail.com';
        var password = '123mnb!';
        request(app)
            .post('/users')
            .send({
                email: email,
                password: password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers["x-auth"]).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                User.findOne({
                    email
                }).then(user => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                });
            });
    });

    it('should not create user if email in use', (done) => {
        var email = users[0].email;
        var password = '123mnb!';
        request(app)
            .post('/users')
            .send({
                email: email,
                password: password
            })
            .expect(400)
            .end(err => {
                if (err) {
                    return done(err);
                }
                done(err);
            });
    });

    it('should return validation errors if request is invalid', done => {
        request(app)
            .post('/users')
            .send({
                email: 'mail',
                password: 123
            })
            .expect(400)
            .end(done);
    });
});

describe('Post /users/login', () => {
    it('should login user and return a token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toHaveProperty("token", res.headers['x-auth']);
                    done();
                }).catch(e => done(e));
            });
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + "*"
            })
            .expect(400)
            .expect((res) => {
                //console.log(res);
                expect(res.headers['x-auth']).not.toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                console.log("User Id", users[1]._id);
                User.findById(users[1]._id).then((user) => {
                    console.log("fetched user", user);
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e => done(e));
            });
    });
})