"use strict";

var api = require("servicenow-lite");
const path = require("path");
var link = require(path.resolve(__dirname, "./link.js"));


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
                    var sysClass = result['dv_sys_class_name'];
                    console.log(sysClass);
                    // Checks what tasks class is and sets state by it
                    var state;
                    switch (result['dv_sys_class_name']) {
                        case 'Incident':
                            state = result['dv_incident_state'];
                            console.log(state);
                            break;
                        case 'Ticket':
                            state = result['dv_state'];
                            console.log(state);
                            break;
                        case 'Problem':
                            state = result['dv_problem_state'];
                            console.log(state);
                            break;
                        case 'Change Request':
                            state = result['dv_state'];
                            console.log(state);
                            break;
                        case 'Change Task':
                            state = result['dv_state'];
                            console.log(state);
                            break;
                        case 'Requested Item':
                            state = result['dv_state'];
                            console.log(state);
                            break;
                        case 'Project Task':
                            state = result['dv_state'];
                            console.log(state);
                            break;
                    }
                    var taskData = {
                        'short_description': result.short_description,
                        'assigned_to': result.assigned_to,
                        'description': result.description,
                        'dv_assigned_to': result.dv_assigned_to,
                        'dv_assignment_group': result.dv_assignment_group,
                        'dv_sys_updated_on': result.dv_sys_updated_on
                    };

                    
                        console.log(JSON.stringify(taskData));
                        response.send(
                            "Short description: " + taskData['short_description'] + "\n" + "Description: " + taskData['description'] + "\n" + 
                            "Assigned to: " + taskData['dv_assigned_to'] + "\n" + "Assignment group: " + taskData['dv_assignment_group'] + "\n" + "State: " + state + "\n" +  
                            "Last updated on: " + taskData['dv_sys_updated_on'] + "\n" + "Link: " + link.urlDirect(activeTask)
                        );
                        response.send("Typical commands: assign to me, give comment <comments>, show comments, close task <close notes>");
                    
                    
                }
            });
    
        }
        
    });
    
}
