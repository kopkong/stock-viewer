
const MongoDb   = require('mongodb');
const assert    = require('assert');
const co        = require('co');
const fs        = require('fs');
const path      = require('path');

const MongoClient = MongoDb.MongoClient;
const URL = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../proxy.conf.json'),'utf8')).mongo.url;

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

    findDocuments = co.wrap(function*(param) {
        var db = yield MongoClient.connect(URL);

        var collection = db.collection(param.name);

        return yield collection.find(param.query).sort(param.sort).toArray();

    });
}
