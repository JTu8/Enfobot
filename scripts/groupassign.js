"use strict";

var api = require("servicenow-lite");
var path = require("path");
var assign = require(path.resolve(__dirname, "./ticketupdate.js"));

module.exports = function(robot) {
    // Assigns ticket to selected group
    robot.respond(/assign (.*) to group (.*)/i, function(response) {
        var ticketNumber = response.match[1];
        var group = response.match[2];
        var updateParams;

        console.log("Ticket number= " + ticketNumber);
        console.log("Group= " + group);

        //Check if group exists
        api.getGroupByName(group, function(err, result) {
            if (err) {
                response.send("Something went wrong, please try again");
                console.error(err);
                return;
            }
            else {
                if (result === undefined) {
                    response.send("Group was not found, please try again");

                }
                else {
                    // Gets sys_id of ticket
                    api.getRecordById(ticketNumber, function(err, result) {
                        if (err) {
                            response.send("Task not found, please try again");
                            console.error(err);
                            return;
                                    }
                        else {
                            // Sets params of field/fields what are going to be updated
                            updateParams = {
                                'sys_id': result.sys_id,
                                'assignment_group': group
                            }

                            console.log("Params=" + JSON.stringify(updateParams));
                            // Calls function that updates assignment_group field
                            assign.updateTask(updateParams, ticketNumber, group, response);
                            response.send("Task " + ticketNumber + " assigned to group " + group);
                        }
                    });
                }
            }
        });

        
    });
};
