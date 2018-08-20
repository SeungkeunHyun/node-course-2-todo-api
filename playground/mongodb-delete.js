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
    // deleteMany
    const db = client.db("TodoApp");
    // deleteONe
    db.collection("Users").findOneAndDelete({
        _id: ObjectID("5b7a0988fadc7b4be7260265")
    }).then(result => {
        console.log(result);
    });
    // findOneAndDelete
    client.close();
});