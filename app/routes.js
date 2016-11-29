// app/routes.js
module.exports = function(app, passport) {

	var mysql = require('mysql');
	var dbconfig = require('../config/database.js');
	var connection = mysql.createConnection(dbconfig.connection);
	var moment = require('moment');

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}),
	function(req, res) {
		if (req.body.remember) {
			req.session.cookie.maxAge = 1000 * 60 * 3;
		} else {
			req.session.cookie.expires = false;
		}
		res.redirect('/');
	});

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	
	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
	
	// set employee information
	app.get('/profile/info', isLoggedIn, function(req, res) {
	    
		connection.query("SELECT name, title, dept FROM " + dbconfig.database + "." + "users WHERE user_id=?", [req.user.user_id], function(err, rows) {
			if (err)
			return console.log(err);
			if (rows.length) {
				var name = '';
				var title = '';
				var dept = '';
				
				// replace nulls with empty string
				if(rows[0].name != 'null'){
					name = rows[0].name;
				}
				
				if(rows[0].title != 'null'){
					title = rows[0].title;
				}
				
				if(rows[0].dept != 'null'){
					dept = rows[0].dept;
				}
				
				var info = {
					name : name,
					title : title,
					dept : dept
				};
				
				res.render('profile-info.ejs', {
					user : req.user,
					info : info
				});
			}
		});
	});
	
	// update employee info
	app.post('/profile/info', isLoggedIn, function(req, res){

		// updates user info
		connection.query("UPDATE " + dbconfig.database + "." + "users SET name=?, title=?, dept=? WHERE user_id=?", 
		[req.body.name, req.body.title, req.body.dept, req.user.user_id], function(err, result){
				if (err)
				return console.log(err);
				else{
					console.log('Updated!');
				}
			});

		res.redirect('/profile');
	});
	

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// =====================================
	// CALENDAR ============================
	// =====================================
	app.get('/calendar', isLoggedIn, function (req, res) {

		// populates a user's calendar with their events
		connection.query("SELECT * FROM " + dbconfig.database + "." + "events WHERE creator=?", [req.user.user_id], function(err, rows) {

			if (err)
			return console.log(err);
			if (rows.length) {
				var results = [];
				for(var i = 0 ; i < rows.length ; i++){
					// create event object
					// insert into results
					// set events below to results
					var event = {
						id : rows[i].event_id,
						title : rows[i].title,
						start : rows[i].start_time,
						end : rows[i].end_time,
						description : rows[i].description,
						created_date : rows[i].created_date
					};
					results.push(event);
				}

				res.render('calendar.ejs', {
					user: req.user,
					results : results
				});
			} else {
				res.render('calendar.ejs', {
					user: req.user,
					results : []
				});
			}
		});
	});

	app.get('/calendar/add', isLoggedIn, function(req, res){
		res.render('calendar-add.ejs');
	});

	app.post('/calendar/add', isLoggedIn, function(req, res){

		// adds an event to a user's calendar
		connection.query("INSERT INTO " + dbconfig.database + "." + "events (creator, start_time, end_time, description, created_date) \
		VALUES (?, ?, ?, ?, ?)", [req.user.user_id, moment(req.body.start_time).format("YYYY-MM-DD HH:mm:ss"), moment(req.body.end_time).format("YYYY-MM-DD HH:mm:ss"),
			req.body.description, moment().format("YYYY-MM-DD HH:mm:ss")], function(err, result){
				if (err)
				return console.log(err);
				else{
					console.log('Added!');
				}
			});

		res.redirect('/calendar');
	});

	// edit an event
	app.post('/calendar/editevent', isLoggedIn, function(req, res){

		// updates user info
		connection.query("UPDATE " + dbconfig.database + "." + "events SET start_time=?, end_time=?, description=?, created_date=? WHERE event_id=?", 
		[moment(req.body.start_time).format("YYYY-MM-DD HH:mm:ss"), moment(req.body.end_time).format("YYYY-MM-DD HH:mm:ss"), req.body.description, moment().format("YYYY-MM-DD HH:mm:ss"), req.body.event_id], function(err, result){
				if (err)
				return console.log(err);
				else{
					console.log('Updated!');
				}
			});

		res.redirect('/calendar');
	});
	
	// delete an event
	app.post('/calendar/deleteevent', isLoggedIn, function(req, res){

		// updates user info
		connection.query("DELETE FROM " + dbconfig.database + "." + "events WHERE event_id=?", 
		[req.body.event_id], function(err, result){
				if (err)
				return console.log(err);
				else{
					console.log('Deleted!');
				}
			});

		res.redirect('/calendar');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
	return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
};
