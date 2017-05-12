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
      try {
        const db = yield MongoClient.connect(URL);

        let collection = db.collection(param.name),
          doc = yield collection.find(param.query).sort(param.sort).toArray();

        db.close();

        return yield doc;

      } catch(err) {
        console.error(err);
      }
    });
}
