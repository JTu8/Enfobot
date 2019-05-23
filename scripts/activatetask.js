"use strict";

var api = require("servicenow-lite");


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
            // Gets saved task from memory and shows info about task
            api.getRecordById(activeTask, function(err, result) {
                if (err) {
                    response.send("Fetching data of task " + activeTask + " failed, please try again");
                }
                else {
                    var taskData = {
                        'short_description': result.short_description,
                        'assigned_to': result.assigned_to
                    };

                    var sysID = result.assigned_to;

                    // Checks if assigned_to is empty
                    if (taskData['assigned_to'].length === 0) {
                        console.log(JSON.stringify(taskData));
                        response.send(
                            "Short description: " + taskData['short_description'] + "\n" + 
                            "Assigned to: " + taskData['assigned_to']
                        );
                        response.send("Typical commands: assign to me, give comment, show comments, close task");
                    }
                    else {
                        //If task is assigned to someone then call function that finds user by sys_id
                        api.getUserByID(sysID, function(err, result) {
                            if (err) {
                                response.send("sys_id was not found, please try again");
                                console.error(err);
                                return;
                            }
                            else {
                                response.send(
                                    "Short description: " + taskData['short_description'] + "\n" + 
                                    "Assigned to: " + result['name']
                                );
                                response.send("Typical commands: assign to me, give comment, show comments, close task");
                            }
                        });
                    }
                    
                }
            });
    
        }
        
    });
    
}
