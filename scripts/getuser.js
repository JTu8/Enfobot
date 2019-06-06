"use strict";

var api = require("servicenow-lite");

module.exports = function (robot) {
    robot.commands.push(
        "Enfobot get user <User> - Gets info about user"
    );
    /*
    robot.respond(/get user (.*)/i, function(response) {
        var user = response.match[1];
        var userInfo;


        api.getUser(user, function(err, result) {
            if (err) {
                response.send("User not found, please try again");
                console.error(err);
            }
            else {
                userInfo = {
                    'name': result.name
                }
                console.log("Username=" + JSON.stringify(userInfo));
                if (userInfo['name'].length === 0) {
                    response.send("User not found, please try again");
                    console.log("Not found");
                }
                else {
                    /*
                    response.send("User info: ");
                    console.log(JSON.stringify(result));
                    response.send(JSON.stringify(result['name']));
                    
                }
                
                
            }
        });

    });
    */

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

    robot.respond(/get user data (.*)/i, function(response) {
        var userName = response.match[1];
        var userData;

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
};
