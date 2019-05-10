"use strict";

var underscore = require("underscore");

// Add user to Enfobots memory
module.exports = function(robot) {
    robot.commands.push(
        "Enfobot save user <User> - Saves username to memory"
    );

    robot.commands.push(
        "Enfobot saved users - Gives you saved users"
    );
    
    robot.commands.push(
        "Enfobot save task <Task number> - Saves task to memory"
    );

    robot.commands.push(
        "Enfobot saved tasks - Gives you saved tasks"
    );

    robot.commands.push(
        "Enfobot forget - Empties memory"
    );

    // Saves user to memory
    robot.respond(/save user (.*)/i, function (response) {
        var user = response.match[1];

        robot.brain.set('user', user);
        response.send("User " + user + " has been saved");
    });

    // Checks if there are any users
    robot.respond(/saved users/i, function(response) {
        var users = robot.brain.get('user') || {};

        if (robot.brain.get('user') == null) {
            response.send("No saved users");
        }
        else {
            response.send("Saved users: " + users);
        }
    });

    // Adds task to memory
    robot.respond(/save task (.*)/i, function(response) {
        var task = response.match[1];

        robot.brain.set('task', task);
        response.send("Task number " + task + " has been saved");
    });

    // Get saved task from memory
    robot.respond(/saved tasks/i, function(response) {
        var savedTask = robot.brain.get('task') || {};
        
        if (robot.brain.get('task') == null) {
            response.send("No saved tasks");
        }
        else {
            response.send("Saved tasks: " + savedTask);
        }   
    });

    robot.respond(/forget/i, function (response) {
        robot.brain.remove('task');
        response.send("No active task number.");
    });
    
};
