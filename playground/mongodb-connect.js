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
    /*
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