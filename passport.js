const createIndividualAccount = require('./todaq_helpers/accounts/createIndividualAccount');

// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;

// load up the user model
var User       = require('./users');

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, username, password, done) {
        if (username)
            username = username.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.username' :  username }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                // all is well, return user
                else 
                    return done(null, user);
                
            });
        });
        
    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {
                User.findOne(
                  {
                   $or: [
                          { 'local.email' : email },
                          { 'local.username' : req.body.username }
                        ]
                 }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'email or username is already taken.'));
                    } else {

                        // create the user
                        var newUser            = new User();

                        newUser.local.email    = email;
                        newUser.local.password = password;
                        newUser.local.username = req.body.username;
                        
                        // TODAQ
                        newUser.local.first_name = req.body.fname;
                        newUser.local.last_name = req.body.lname;
                        newUser.local.phone = req.body.phone;
                        newUser.local.address.city = req.body.city;
                        newUser.local.address.postcode = req.body.postcode;
                        newUser.local.address.province = req.body.province;
                        // TODO : FIX Country CODE in future!
                        newUser.local.address.country = 'CA';

                        const newAccount = {
                            type: 'account',
                            data: {
                                attributes: {
                                    'account-type': 'individual',
                                    'admin-email': 'peter.wiggen@example.com',
                                    contact: {
                                        email: email,
                                        phone: req.body.phone,
                                        'last-name': req.body.lname,
                                        'first-name': req.body.fname,
                                        address: {
                                            city: req.body.city,
                                            'postal-code': req.body.postcode,
                                            'province-region': req.body.province,
                                            'street-address-1': req.body.street,
                                            country: 'CA',
                                        },
                                    },
                                },
                            },
                        };

                        createIndividualAccount(newAccount).then((data) => {
                            newUser.local.account = data[0].id; 
                            console.log("-> " + newUser.local.account);
                            console.log("Created user account. New id:" + newUser.local.account);
                            newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                            });
                        });
                    } 

                });
            // if the user is logged in but has no local account...
          } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user);
            }

        });

    }));

};
