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

        
};
