//const MongoClient = require('mongodb').MongoClient;
const {
    MongoClient,
    ObjectID
} = require('mongodb');


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
    db.collection("Users").findOneAndUpdate({
        _id: ObjectID("5b79e28fa7eaed1098d6a27b")
    }, {
        $set: {
            name: "Seungkeun",
            location: "통일로 547"
        },
        $inc: {
            age: -4
        }
    }, {
        returnOriginal: true
    }).then(result => {
        console.log(result);
    });
    // findOneAndDelete
    client.close();
});