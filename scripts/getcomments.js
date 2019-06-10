"use strict";

const api = require("servicenow-lite");

module.exports = function(robot) {
    robot.commands.push(
        "Enfobot get comments from <tasknumber> - Gives you comments of task"
    );

    robot.respond(/get comments from (.*)/i, function(response) {
        var taskNumber = response.match[1];
        var taskParams;
        var comments;
        
        api.getRecordById(taskNumber, function(err, result) {
            if (err) {
                response.send("Task was not found, please try again");
                console.error(err);
                return;
            }
            else {
                taskParams = result['sys_id'];
                console.log(taskParams);
            }

            api.getCommentByTask(taskParams, function(err, result) {
                if (err) {
                    response.send("Comment fetching failed, please try again");
                    console.error(err);
                    return;
                }
                else {
                    response.send("Success!");
                    console.log(JSON.stringify(result));
                }
            });
        });

    });

        
};
