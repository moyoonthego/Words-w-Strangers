//setup =================================================
var express = require('express');
var request = require('request');
var path = require('path');
var http= require('http');
var mongoose = require('mongoose');
var session = require('express-session');
var expressValidator = require('express-validator');
var passport = require('passport');
var pg = require('pg');
var flash = require('connect-flash');
//var User = require('./models/users');
var uristring = process.env.MONGODB_URI || process.env.MONGOLAB_RED_URI || 'mongodb://localhost/';
var theport = process.env.PORT || 5000;
var uristring = 'mongodb://heroku_f9nb6r1s:a0ojrjrdrr6at3br8s6efvuo35@ds129796.mlab.com:29796/heroku_f9nb6r1s';
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cfg = require('./todaq_helpers/config.js');
console.log(cfg);
var app = express();

const createFile = require('./todaq_helpers/files/createFile');
const {word, sampleWord} = require('./Word');

const mainController = require('./controllers/main.controller.js');

mongoose.connect(uristring, function (err, res){
  if (err){
    console.log('ERROR connecting to: ' + uristring + '. ' + err);
  }
  else{
    console.log('Succeeded connected to: ' + uristring);
  } 
});


//config ==============================================
require('./passport')(passport); 
app.use(expressValidator());
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('.html', require('ejs').__express);

app.use(session({
  secret: 'apfepaijfpoaijsopefi',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('port', theport);

app.use(express.static(__dirname + '/public'));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(request, response) {
  response.render('pages/login')
});


module.exports = app;

// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });
app.get('/', function(request, response) {
  response.render('pages/index')
})
    app.get('/index', function(req, res) {
        res.render('pages/index');  
    })

    app.get('/words', function(req, res) {
        console.log("Requested Account Summary: " + req.user.local.account);

        var request = require('request');
        var acc = "https://api.todaqfinance.net/accounts/" + req.user.local.account + "/files?page=1&limit=100";

        var options = {
          'method': 'GET',
          'url': acc,
          'headers': {
            'Content-Type': 'application/json',
            'x-api-key': '01bfb8d6-e846-4e47-a63d-332d1b76b2c2'
          }
        };
        request(options, function (error, response) { 
          if (error) throw new Error(error);
          console.log(response.body);
        }); // receive all the words of the person in a response.body

        // var xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;

        // xhr.addEventListener("readystatechange", function() {
        //   if(this.readyState === 4) {
        //     console.log(this.responseText);
        //   }
        // });
        // var acc = "https://api.todaqfinance.net/accounts/" + req.user.local.account;
        // xhr.open("GET", acc);
        // xhr.setRequestHeader("Content-Type", "application/json");
        // xhr.setRequestHeader("x-api-key", "01bfb8d6-e846-4e47-a63d-332d1b76b2c2");

        // xhr.send();

        res.render('pages/information');  
        res.end();
    })

    app.get('/login', function(req, res) {
        res.render('pages/login');
    })

    app.get('/marketplace', function(req, res) {
        console.log("M: " + req.user.local.account);
        res.render('pages/marketplace');
    })

    app.get('/confirmation', function(req, res) {
        res.render('pages/confirmation');
    })

    app.get('/submit', function(req, res) {
        res.render('pages/submit');
    })

    app.get('/specialty', function(req, res) {
        res.render('pages/specialty');
    })

    app.get('/psychiatry', function(req, res) {
        res.render('pages/psychiatry');
    })

    app.get('/information', function(req, res) {
        res.render('pages/information');
    })

    app.get('/physician', function(req, res) {
        res.render('pages/physician');
    })

    app.get('/gameplay', function(req, res) {
        res.render('pages/gameplay');
    })

    app.get('/weyleong', function(req, res) {
        res.render('pages/weyleong');
    })

    app.get('/patient', function(req, res) {
        res.render('pages/patient');
    })

    app.get('/psychiatrists', function(req, res) {
        res.render('pages/psychiatrists');
    })

    app.get('/signup', function(req, res) {
        res.render('pages/signup', {
            message: req.flash('signupMessage'),
            loggedIn: req.user,
            user: req.user,
            status: 'signup',

        });
    })

    app.get('/search', mainController.getSearch);

    app.post('/locations/newId', mainController.newLocation);

    app.post('/locations/removeId', mainController.removeLocation);


    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/search', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/confirmation', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // process the word creation
    app.post('/create-words', (req, res) => {
        console.log("Creating Word: " + req.body.word);
        console.log(req.body);
        console.log("R " + req.user.local.username);
        console.log("Using " + req.user.local.account);

        const word = {
            name: req.body.word
        };

        createFile(word, req.user.local.account).then(data => console.log(data));
          
        res.redirect('/marketplace');
    });

function loggedIn(req, res, next) {
    if (req.user) {
        next();
        return true;
    } else {
        res.redirect('/login');
        return false;
    }
}

    app.get('/logout', function(req, res) {
        req.logout();
        req.session.save(function() {
            res.redirect('/login');
        });
    }); 

app.get('/user', function(req, res) {
        const errors = req.validationErrors();
        if (errors){
            req.flash('errors', errors.map(err =>err.msg));
            res.redirec('/user');
        }
        //console.log(req.user.local.username);
        res.render('pages/user', {
            user: req.user.local.username
        });
    })



   // app.post('/search/newUser', mainController.createUser);
