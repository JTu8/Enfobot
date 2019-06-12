"use strict";

var api = require("servicenow-lite");
var path = require("path");
var update = require(path.resolve(__dirname, "./ticketupdate.js"));

module.exports = function (robot) {
    robot.commands.push(
        "Enfobot comment <ticket number> - <comments>"
    );

    robot.respond(/comment (.*) - (.*)/i, function(response) {
        var ticketNumber = response.match[1];
        var comment = response.match[2];
        var updateParams;

        // Gets sys_id of ticket 
        api.getRecordById(ticketNumber, function(err, result) {
            if (err) {
                response.send("Something went wrong, please try again");
                console.error(err);
                return;
            }
            else {
            
                    updateParams = {
                        'sys_id': result.sys_id,
                        'work_notes': comment,
                    };
                    console.log("Params= " + JSON.stringify(updateParams));
                    // Adds comment to ticket
                    update.updateTask(updateParams, ticketNumber, response);
                    response.send("Comments added to task " + ticketNumber);
                
                
                
            }
        });
    });
};
