"use strict";

var api = require("servicenow-lite");
var path = require("path");
var assign = require(path.resolve(__dirname, "./ticketupdate.js"));


module.exports = function(robot) {
    // Assign task to user from memory
    robot.respond(/assign to (.*)/i, function(response) {
        var person = response.match[1];
        // Gets user from memory
        person = robot.brain.get('user') || {};

        // Gets saved task from memory
        var savedTask = robot.brain.get('task') || {};
        console.log(savedTask);

        if (robot.brain.get('user') == null || robot.brain.get('task') == null) {
            response.send("No saved users or tasks");
            response.send("Save user using command Enfobot save user <User> or assign user with command " + 
                            "Enfobot assign <tasknumber> to person|group - <person|group>");
        }
        else {
            // Gets sys_id of saved task
            api.getRecordById(savedTask, function(err, result) {
                if (err) {
                    response.send("Task was not found, please try again");
                    console.error(err);   
                }
                else {
                    var assignParams = {
                        'sys_id': result.sys_id,
                        'assigned_to': person
                    }
                    console.log("Params= " + JSON.stringify(assignParams));

                    assign.updateTask(assignParams, savedTask, person, response);
                    response.send("Task " + savedTask + " assigned to " + person);
                }
            });           

        }
    
    });
};



