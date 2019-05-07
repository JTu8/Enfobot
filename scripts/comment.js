"use strict";

var api = require("servicenow-lite");

module.exports = function (robot) {
    robot.commands.push(
        "Enfobot comment <ticket number> from <prefix> - <comments>"
    );

    robot.respond(/comment (.*) from (.*) - (.*)/i, function(response) {
        var ticketNumber = response.match[1];
        var prefix = response.match[2];
        var comment = response.match[3];
        var updateParams;

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
                    'work_notes': comment
                };
                console.log("Params= " + JSON.stringify(updateParams));
                // Adds comment to ticket
                api.updateTicket(updateParams, prefix, function(err, result) {
                    if (err) {
                        response.send("Commenting failed, please try again");
                    }
                    else {
                        response.send("Comments added to task " + ticketNumber);
                        console.log(JSON.stringify(result));
                    }
                });
            }
        });
    });
};