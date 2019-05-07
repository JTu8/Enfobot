"use strict";

var underscore = require("underscore");

// Add user to Enfobots memory
module.exports = function(robot) {
    robot.commands.push(
        "Enfobot save me <User> - Saves username to memory"
    );

    robot.commands.push(
        "Enfobot users - Gives you saved users"
    );
    
    robot.commands.push(
        "Enfobot save task <Task number> - Saves task to memory"
    );

    robot.commands.push(
        "Enfobot saved tasks - Gives you saved tasks"
    );

    // Saves user to memory
    robot.respond(/save me (.*)/i, function (response) {
        var savedUser = robot.brain.knownUsers || {};
        var hipchatName = response.message.user.name;
        var serviceNowUser = response.match[1];

        savedUser[hipchatName] = serviceNowUser;
        robot.brain.knownUsers = savedUser;

        console.log("Saved user = " + serviceNowUser);
        response.send("User has been saved");
    });

    // Checks if there are any users
    robot.respond(/users/i, function(response) {
        var users = robot.brain.knownUsers || {};
        var hipChatNames = underscore.keys(users);
        hipChatNames.sort();

        var rows = hipChatNames.map(function(hipchatName) {
            return hipchatName + " -- " + users[hipchatName];
        });

        response.send(rows);
    });

    
};