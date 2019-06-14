"use strict";

const api = require("servicenow-lite");

module.exports = function(robot) {
    robot.commands.push(
        "Enfobot get comments from <tasknumber> - Gives you comments of task"
    );

    robot.respond(/get comments from (.*)/i, function(response) {
        var taskNumber = response.match[1];
        var taskParams;
        
        api.getRecordById(taskNumber, function(err, result) {
            if (err) {
                response.send("Task was not found, please try again");
                console.error(err);
                return;
            }
            else {
                taskParams = result['dv_comments_and_work_notes'];
                console.log(taskParams);
                response.send(taskParams);
            }

        });

    });

    //Shows comment from active task
    robot.respond(/show comments/i, function(response) {
        var taskNumber = robot.brain.get('task') || {};
        var taskParams;
        console.log(taskNumber);
        // Checks memory if memory is null
        if (robot.brain.get('task') == null) {
            response.send("No active tasks");
            response.send("Either active task by using Enfobot active <tasknumber> or use command Enfobot get comments from <tasknumber>");
        }
        else {
            // Gets data from comments and work notes field
            api.getRecordById(taskNumber, function(err, result) {
                if (err) {
                    response.send("Task was not found, please try again");
                    console.error(err);
                    return;
                }
                else {
                    taskParams = result['dv_comments_and_work_notes'];
                    console.log(taskParams);
                    response.send(taskParams);
                }
            });
        }
        


    });

        
};
