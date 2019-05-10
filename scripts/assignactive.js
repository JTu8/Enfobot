"use strict";

var api = require("servicenow-lite");

module.exports = function(robot) {
    // Assign task to user from memory
    robot.respond(/assign to (.*)/i, function(response) {
        var person = response.match[1];
        // Gets user from memory
        person = robot.brain.get('user') || {};

        if (robot.brain.get('user') == null) {
            response.send("No saved users");
        }
        else {
            response.send("Task assigned to user: " + person);
            var savedTask = robot.brain.get('task') || {};
            console.log(savedTask);
            api.getRecordById(savedTask, function(err, result) {

            });           

        }
    
    });
};



