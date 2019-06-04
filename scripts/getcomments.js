"use strict";

const api = require("servicenow-lite");

module.exports = function(robot) {
    robot.commands.push(
        "Enfobot get comments from <tasknumber> - Gives you comments of task"
    );

    robot.respond(/get comments from (.*)/i, function(response) {
        var taskNumber = response.match[1];

        
    });
};
