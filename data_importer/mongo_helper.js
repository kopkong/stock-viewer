/**
 * Created by colin on 2016/11/10.
 */
const MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    url = 'mongodb://localhost:27017/stock';

exports.insertDocuments = function (name, value, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);

        var collection = db.collection(name);

        collection.insertMany(value, function (err, result) {
            assert.equal(err, null);

            db.close();

            if(typeof callback === 'function') callback();
        });
    });
};

exports.findDocuments = function (name, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);

        // Get the documents collection
        var collection = db.collection(name);

        // Find some documents
        collection.find({}).toArray(function (err, docs) {
            assert.equal(err, null);

            console.log(docs.length);

            db.close();

          if(typeof callback === 'function') callback(docs);

        });

    });
};



