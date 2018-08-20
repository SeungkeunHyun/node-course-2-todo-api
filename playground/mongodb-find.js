//const MongoClient = require('mongodb').MongoClient;
const {
    MongoClient,
    ObjectID
} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

var mongoCallback = (err, result) => {
    if (err) {
        return console.error('Unable to insert a document', err);
    }
    console.log(result.ops[0]._id.getTimestamp(), JSON.stringify(result.ops, undefined, 2));
}

connection = MongoClient.connect("mongodb://localhost:27017/TodoApp", {
    useNewUrlParser: true
}, (err, client) => {
    if (err) {
        return console.error(`Unable to connecto MongoDB server: ${err.message}`);
    }
    console.log('Connected to MongoDB server');
    const db = client.db("TodoApp");
    db.collection('Users').find({
        name: "Sk"
    }).toArray().then((users) => {
        console.log("Users : ", JSON.stringify(users, undefined, 2));
    });
    /*
    var docs = db.collection("Todos").find({
        _id: new ObjectID("5b79e815fadc7b4be725f61e")
    }).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });
   
    db.collection("Todos").insertOne({
        text: "Something to do",
        completed: true
    }, (err, result) => {
        if (err) {
            return console.error(`Unable to insert todo ${err.message}`, err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });
    db.collection("Users").insertOne({
        "name": "Sk",
        "age": 44,
        "location": "Seoul"
    }, mongoCallback);
    */
    client.close();
});