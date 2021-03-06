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
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
    it('should not return todo doc created by other user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
    it('should return 404 if todo not found', done => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123abc')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    })
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', done => {
        var hexId = todos[0]._id.toHexString();
        var text = 'This should be the new text';
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });
    it('should clear completedAt when todo is not completed', done => {
        var hexId = todos[1]._id.toHexString();
        var text = 'This should be the new text!!';
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect(res => {
                //console.log(res);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done);
    });

    it('should not update the todo created by other user', done => {
        var hexId = todos[1]._id.toHexString();
        var text = 'This should be the new text!!';
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                completed: false,
                text
            })
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect(res => {
                //console.log(res);
                expect(res.body.todo._id).toBe(hexId);
                Todo.findById(hexId).then(todo => {
                    expect(todo).toBeFalsy();
                });
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete(`/todos/123abc`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
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
                    expect(user.tokens[1]).toHaveProperty("token", res.headers['x-auth']);
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
                //console.log("User Id", users[1]._id);
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch(e => done(e));
            });
    });
})

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        // DELETE /users/me/token
        // Set x-auth equal to token
        // 200
        // Find user, verify that tokens array has length of zero
        request(app)
            .delete("/users/me/token")
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[0]._id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e => done(e));
            });
    });
});