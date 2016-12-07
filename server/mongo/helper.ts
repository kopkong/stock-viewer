
import MongoDb = require('mongodb');
import assert = require('assert');

const MongoClient = MongoDb.MongoClient;
const URL = 'mongodb://localhost:27017/stock';

export default class Helper {
    insertDocuments(name, value, callback) {
        MongoClient.connect(URL, function (err, db) {
            assert.equal(null, err);

            var collection = db.collection(name);

            collection.insertMany(value, function (err, result) {
                assert.equal(err, null);

                db.close();

                callback();
            });
        });
    }

    findDocuments(name) {
        MongoClient.connect(URL, function (err, db) {
            assert.equal(null, err);

            // Get the documents collection
            var collection = db.collection(name);

            // Find some documents
            collection.find({}).toArray(function (err, docs) {
                assert.equal(err, null);

                console.log(docs.length);
                db.close();
            });

        });
    }
}
