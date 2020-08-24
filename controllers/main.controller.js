var Location = require('../models/locations');
var User = require('../users');
var Message = require('../models/message');
var mongoose = require('mongoose');

module.exports = {
    newLocation: newLocation,
//    createUser: createUser,
    getSearch: getSearch,
    removeLocation: removeLocation
}

function newLocation(req, res){
    const errors = req.validationErrors();
    if (errors){
        req.flash("errors", errors.map(err => err.msg));
        res.redirect('/search');
    }
    else{
    //find user
        Location.findOne({
            'user': req.user.local.username
        })    
        .then(function (data){
            if (!data){
                res.send("nothing in the database!");
            }
            else{
                data.names.push(req.body.name);
                Location.findOneAndUpdate({'user' : req.user.local.username}, 
                {
                    user: req.user.local.username,
                    names: data.names
                }, {upsert: true}, function(err, doc){
                    if (err) return res.send(500, {error: err});
                });
                res.redirect('/search');
            }
        })
    //take user's location and add id to list if its not inside

    }
}


function removeLocation(req, res){
    const errors = req.validationErrors();
    if (errors){
        req.flash("errors", errors.map(err => err.msg));
        res.redirect('/search');
    }
    else{
        var user = req.body.user;
        var name = req.body.name;


        Location.findOne({
            'user' : user
        })
        .then(function(data){
            if(!data){
                res.send("Could not find user!");
            }
            else{
                var locations = data.names;
                for (i = 0; i < locations.length; i++){
                    if (locations[i] == name){
                        locations.splice(i, 1);
                        break;
                    }
                   
                }
                Location.findOneAndUpdate({'user' : user}, 
                {
                    user: user,
                    names: locations
                }, {upsert: true}, function(err, doc){
                    if (err) return res.send(500, {error: err});
                });
            }

        });
        
        res.redirect('/search');
    }

}

        
/**
function createUser(req, res){
    
        User.create(
            {
                
                    username: "Fred",
                    password: "Random",
                    locations: []
                    
        

            }, function(err, person){
                if (err) return console.error(err);  
            }   
        );
        res.redirect("/search");    
    
}
**/

function getSearch(req, res){
    const errors = req.validationErrors();
    //console.log(req.user.local.username);
    if (errors){

        req.flash('errors', errors.map(err => err.msg));
        res.redirect('/user');
    }
    Location.findOne({
        user : req.user.local.username 
    })
    .then (function(data){
        var output = data;
        if (!data){

            Location.create({
                user : req.user.local.username,
                names : []
            });
            output = [];
        }
        else{
            output = data.names;
        }
        console.log(req.user);
        res.render('pages/search', 
        {
            locations : output,
            user : req.user.local.username
        });
    
    });


}

/**
function createUser(req, res){
    User.findOne({
        'local.username': "Fred"
    })
    .then(function (data){
        if (!data){
            res.send("nothing in the database!");
        }
        else{
            console.log(data);

        }

    })

}
**/
