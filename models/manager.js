var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var passportLocalMongoose = require("passport-local-mongoose");

var managerSchema = new mongoose.Schema({
  name: String,
  type: String,
  username: String,
  password: String,
  department: String,
  image: String,
  leaves: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leave"
    }
  ]
});

managerSchema.plugin(passportLocalMongoose);
var Manager = (module.exports = mongoose.model("Manager", managerSchema));

module.exports.createManager = function(newManager, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newManager.password, salt, function(err, hash) {
      newManager.password = hash;
      newManager.save(callback);
    });
  });
};

module.exports.getUserByUsername = function(username, callback) {
  var query = { username: username };
  Manager.findOne(query, callback);
};

module.exports.getUserById = function(id, callback) {
  Manager.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, passwordFound) {
    if (err) throw err;
    callback(null, passwordFound);
  });
};