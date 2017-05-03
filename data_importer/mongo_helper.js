/**
 * Created by colin on 2016/11/10.
 */
const MongoClient = require('mongodb').MongoClient,
  assert = require('assert'),
  fs = require('fs'),
  co = require('co'),
  path = require('path'),
  url = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../proxy.conf.json'), 'utf8')).mongo.url;

// console.log(url);

exports.insertDocuments = function (name, value, callback) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);

    var collection = db.collection(name);

    collection.insertMany(value, function (err, result) {
      assert.equal(err, null);

      db.close();

      if (typeof callback === 'function') callback();
    });
  });
};

exports.deleteDocuments = function (name, value, callback) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);

    var collection = db.collection(name);

    collection.deleteMany(value, function (err, result) {
      assert.equal(err, null);

      db.close();

      if (typeof callback === 'function') callback();
    });
  });
};

exports.updateDocument = function (name, filter, update, upsert, callback) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);

    var collection = db.collection(name);

    collection.updateOne(filter, update, {upsert: upsert}, function (err, result) {
      assert.equal(err, null);

      db.close();

      if (typeof callback === 'function') callback();
    });
  });
};

exports.findDocuments = co.wrap(function *(name, sort) {

  try {
    const db = yield MongoClient.connect(url);

    let collection = db.collection(name),
      doc = yield collection.find({}).sort(sort).toArray();

    db.close();

    return yield doc;

  } catch(err) {
    console.error(err);
  }
});




