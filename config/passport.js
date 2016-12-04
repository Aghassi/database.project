// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {

    var addSubordinates = function(manager, id, signup) {
      var queryUsers = "";

      // Check for people who the manager manages
      if (signup) {
        queryUsers = "SELECT u.user_id, u.dept FROM users u, managers m WHERE m.user_id != u.user_id AND u.dept = ?";

        connection.query(queryUsers, [manager.dept], function(err, rows) {
          console.log("Users in same department: " + rows);
          for (var i = 0; i < rows.length; i++) {
            connection.query("INSERT INTO manages ( manager_id, user_id ) values (?,?)", [id, rows[i].user_id], function(err,rows){
              if (err) throw err;
            });
          }
        });
      } else {
        queryUsers = "SELECT u.user_id FROM users u LEFT JOIN manages m ON u.user_id = m.user_id WHERE m.user_id IS NULL AND u.user_id != ? u.dept = ?";

        connection.query(queryUsers, [id, manager.dept], function(err, rows) {
          console.log("Users in same department not yet added: " + rows);
          for (var i = 0; i < rows.length; i++) {
            connection.query("INSERT INTO manages ( manager_id, user_id ) values (?,?)", [id, rows[i].user_id], function(err,rows){
              if (err) throw err;
            });
          }
        });
      }
    };

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log(user);
        if(user.id === undefined){
            done(null, user.user_id);
        }
        else{
            done(null, user.id);
        }
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE user_id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    }
                    // Check if manager already exists
                    if (req.body.isManager == "on") {
                      connection.query("SELECT COUNT(user_id) as number FROM managers WHERE dept = ?", req.body.dept, function(err, rows) {
                        console.log("Number of managers: " + rows[0].number);
                        if (rows[0].number > 0) {
                          return done(null, false, req.flash('signupMessage', 'Manager already exists for that department.'));
                        } else {
                          // if there is no user with that username
                          // create the user
                          var newUserMysql = {
                              username: username,
                              password: bcrypt.hashSync(password, null, null),  // use the generateHash function in our user model
                              name: req.body.name,
                              title: req.body.title,
                              dept: req.body.dept
                          };

                          var insertQuery = "INSERT INTO users ( username, password, name, title, dept ) values (?,?,?,?,?)";

                          connection.query(insertQuery,[newUserMysql.username, newUserMysql.password, newUserMysql.name, newUserMysql.title, newUserMysql.dept],function(err, rows) {
                              if (err) throw err;
                              newUserMysql.id = rows.insertId;

                              if (req.body.isManager == "on") {
                                var insertManagerQuery = "INSERT INTO managers ( user_id, dept ) values (?,?)";

                                connection.query(insertManagerQuery, [newUserMysql.id, newUserMysql.dept], function(err, rows) {
                                  if (err) throw err;

                                  addSubordinates(newUserMysql, newUserMysql.id, true);
                                });
                              }

                              return done(null, newUserMysql);
                          });
                        }
                      });
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUserMysql = {
                            username: username,
                            password: bcrypt.hashSync(password, null, null),  // use the generateHash function in our user model
                            name: req.body.name,
                            title: req.body.title,
                            dept: req.body.dept
                        };

                        var insertQuery = "INSERT INTO users ( username, password, name, title, dept ) values (?,?,?,?,?)";

                        connection.query(insertQuery,[newUserMysql.username, newUserMysql.password, newUserMysql.name, newUserMysql.title, newUserMysql.dept],function(err, rows) {
                            if (err) throw err;
                            newUserMysql.id = rows.insertId;

                            return done(null, newUserMysql);
                        });
                    }
                });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // Add new users to manager if need be
                var user = rows[0];
                connection.query("SELECT COUNT(user_id) as number FROM managers WHERE user_id = ?", rows[0].user_id, function(err, rows){
                  if (rows[0].number === 1) {
                    addSubordinates(user, user.user_id, false);
                  }
                });

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
};
