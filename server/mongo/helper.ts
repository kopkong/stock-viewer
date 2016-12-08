
const MongoDb  = require('mongodb');
const assert   = require('assert');
const co       = require('co');

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

    findDocuments = co.wrap(function*(name) {
        var db = yield MongoClient.connect(URL);

        var collection = db.collection(name);

        return yield collection.find({}).toArray();

    });
}
