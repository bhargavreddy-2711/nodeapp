var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var passportLocalMongoose = require("passport-local-mongoose");

var techleadSchema = new mongoose.Schema({
  name: String,
  type: String,
  username: String,
  password: String,
  department:String,
  salary: Number,
  image: String
});

techleadSchema.plugin(passportLocalMongoose);
var Techlead = (module.exports = mongoose.model("Techlead", techleadSchema));

module.exports.createTechlead = function(newTechlead, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newTechlead.password, salt, function(err, hash) {
      newTechlead.password = hash;
      newTechlead.save(callback);
    });
  });
};

module.exports.getUserByUsername = function(username, callback) {
  var query = { username: username };
  Techlead.findOne(query, callback);
};

module.exports.getUserById = function(id, callback) {
  Techlead.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, passwordFound) {
    if (err) throw err;
    callback(null, passwordFound);
  });
};