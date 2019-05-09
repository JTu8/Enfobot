"use strict";

var api = require("servicenow-lite");
var prettyjson = require("prettyjson");
var path = require('path');



// Gets task from memory and you can work with that task
module.exports = function(robot) {
    robot.commands.push(
        "Enfobot active <Task number> - Activate task number and work with it"
    );

    robot.respond(/active (.*)/i, function (response) {
        var task = response.match[1];
        // Saves task to memory
        robot.brain.set('task', task);

        response.send(task + " is now active");

        var activeTask = robot.brain.get('task') || {};
        if (robot.brain.get('task') == null) {
            response.send("No saved tasks");
        }
        else {
            // Gets saved task from memory and show info about task
            api.getRecordById(activeTask, function(err, result) {
                if (err) {
                    response.send("Fetching data of task " + activeTask + " failed, please try again");
                }
                else {
                    var taskData = {
                        'short_description': result.short_description,
                        'assigned_to': result.assigned_to
                    };
                    response.send(prettyjson.render(taskData));
                    response.send("Typical commands: assign to <me/person/group>, show comments, close task");
                }
            });
    
        }
        
    });

    robot.respond(/assign to (.*)/i, function(response) {
        var person = response.match[1];

        person = robot.brain.get('user') || {};

        if (robot.brain.get('user') == null) {
            response.send("No saved users");
        }
        else {
            response.send("User not found: " + person);
        }

        

    });


}