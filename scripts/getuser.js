"use strict";

var api = require("servicenow-lite");
// Gets data about user and group
module.exports = function (robot) {
    robot.commands.push(
        "Enfobot get user <User> - Gets info about user"
    );
    
    robot.respond(/get username (.*)/i, function(response) {
        var sysID = response.match[1];

        api.getUserByID(sysID, function(err, result) {
            if (err) {
                response.send("sys_id was not found, please try again");
                console.error(err);
                return;
            }
            else {
                response.send("Username: " + result['name']);
                console.log(JSON.stringify(result));
                
            }
        });
        
    });

    robot.respond(/get username by email (.*)/i, function(response) {
        var email = response.match[1];

        api.getUserByEmail(email, function(err, result) {
            if (err) {
                response.send("Something went wrong");
            }
            else {
                response.send("Username: " + JSON.stringify(result));
                console.log(JSON.stringify(result));
            }
        });
    });

    robot.respond(/get user data (.*)/i, function(response) {
        var userName = response.match[1];

        api.getUserName(userName, function(err, result) {
            if (err) {
                response.send("Something went wrong, please try again");
                console.error(err);
                return;
            }
            else {
                if (result === undefined) {
                    console.log("Not found");
                    response.send("User was not found, please try again");
                }
                else {
                    response.send("Users data " + JSON.stringify(result));
                    console.log(JSON.stringify(result));
                }
                
            }
        });
    });

    robot.respond(/get group (.*)/i, function(response) {
        var sysID = response.match[1];

        api.getGroupByID(sysID, function(err, result) {
            if (err) {
                response.send("Something went wrong, please try again");
                console.error(err);
                return;
            }
            else {
                response.send("Success!");
                console.log("Groups data " + JSON.stringify(result));
            }
        }); 
    });

    
};
