"use strict";

var api = require("servicenow-lite");
var path = require("path");
var assign = require(path.resolve(__dirname, "./ticketassign.js"));

module.exports = function(robot) {

    robot.respond(/assign (.*) to group (.*)/i, function(response) {
        var ticketNumber = response.match[1];
        var group = response.match[2];
        var updateParams;

        console.log("Ticket number= " + ticketNumber);
        console.log("Group= " + group);

        // Gets sys_id of ticket
        api.getRecordById(ticketNumber, function(err, result) {
            if (err) {
                response.send("Task not found, please try again");
                console.error(err);
                return;
            }
            else {
                updateParams = {
                    'sys_id': result.sys_id,
                    'assignment_group': group
                }

                console.log("Params=" + JSON.stringify(updateParams));
                // Calls function that assigns ticket to group
                assign.updateTask(updateParams, ticketNumber, group, response);
            }
        });
    });
};
