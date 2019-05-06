"use strict";

var api = require("servicenow-lite");

module.exports = function(robot) {
    robot.commands.push(
        "Enfobot update ticket <number> from <prefix> with <Short description> - Updates selected tickets short description field"
    );

    robot.respond(/update ticket (.*) from (.*) with (.*)/i, function (response) {
        var ticketNumber = response.match[1];
        var prefix = response.match[2];
        var param = response.match[3];
        var updateParams;

        console.log("Ticket number = " + ticketNumber);
        console.log("Prefix = " + prefix);
        console.log("Param = " + param);
        // Gets sys_id of ticket
        api.getRecordById(ticketNumber, function(err, result) {
            if (err) {
                response.send("Ticket number was not found, please try again");
                console.error(err);
            }
            else {
                updateParams = {
                    'sys_id': result.sys_id,
                    'short_description': param
                };
                console.log("Params = " + JSON.stringify(updateParams));

                // Updates ticket
                api.updateTicket(updateParams, prefix, function(err, result) {
                    if (err) {
                        response.send("Update failed, please try again");
                        console.error(err);
                        return;
                    }
                    else {
                        response.send("Ticket updated");
                        response.send(JSON.stringify(result));
                    }
            });
            }
        });
        

    });
};