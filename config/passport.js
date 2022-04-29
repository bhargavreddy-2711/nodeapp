const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

//include models
Employee = require("../models/employee");
Techlead = require("../models/techlead");
Manager = require("../models/manager");
Leave = require("../models/leave");



//stratergies
passport.use(
    "employee",
    new LocalStrategy((username, password, done) => {
      Employee.getUserByUsername(username, (err, employee) => {
        if (err) throw err;
        if (!employee) {
          return done(null, false, { message: "Unknown User" });
        }
        Employee.comparePassword(
          password,
          employee.password,
          (err, passwordFound) => {
            if (err) throw err;
            if (passwordFound) {
              return done(null, employee);
            } else {
              return done(null, false, { message: "Invalid Password" });
            }
          }
        );
      });
    })
  );
  
  passport.use(
    "manager",
    new LocalStrategy((username, password, done) => {
      Manager.getUserByUsername(username, (err, manager) => {
        if (err) throw err;
        if (!manager) {
          return done(null, false, { message: "Unknown User" });
        }
        Manager.comparePassword(password, manager.password, (err, passwordFound) => {
          if (err) throw err;
          if (passwordFound) {
            return done(null, manager);
          } else {
            return done(null, false, { message: "Invalid Password" });
          }
        });
      });
    })
  );
  
  passport.use(
    "techlead",
    new LocalStrategy((username, password, done) => {
      Techlead.getUserByUsername(username, (err, techlead) => {
        if (err) throw err;
        if (!techlead) {
          return done(null, false, { message: "Unknown User" });
        }
        Techlead.comparePassword(
          password,
          techlead.password,
          (err, passwordFound) => {
            if (err) throw err;
            if (passwordFound) {
              return done(null, techlead);
            } else {
              return done(null, false, { message: "Invalid Password" });
            }
          }
        );
      });
    })
  );

  //srialize

passport.serializeUser(function(user, done) {
    // console.log(user.id);
    done(null, { id: user.id, type: user.type });
  });
  
  //deserialize
  
  passport.deserializeUser(function(obj, done) {
    switch (obj.type) {
      case "employee":
        Employee.getUserById(obj.id, function(err, employee) {
          done(err, employee);
        });
        break;
      case "manager":
        Manager.getUserById(obj.id, function(err, manager) {
          done(err, manager);
        });
        break;
      case "techlead":
        Techlead.getUserById(obj.id, function(err, techlead) {
          done(err, techlead);
        });
        break;
      default:
        done(new Error("no entity type:", obj.type), null);
        break;
    }
  });