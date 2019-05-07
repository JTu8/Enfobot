"use strict";

var api = require("servicenow-lite");

module.exports = function (robot) {
    robot.commands.push(
        "Enfobot get user <User> - Gets info about user"
    );

    robot.respond(/get user (.*)/i, function(response) {
        var user = response.match[1];

        api.getUser(user, function(err, result) {
            if (err) {
                response.send("User not found, please try again");
                console.error(err);
            }
            else {
                response.send("User info: ");
                console.log(result);
            }
        });
    });
};