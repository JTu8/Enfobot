"use strict";

var api = require("servicenow-lite");
var path = require("path");
var close = require(path.resolve(__dirname, "./ticketupdate.js"));

module.exports = function (robot) {
    robot.commands.push(
        "Enfobot close task <tasknumber> - <comments>"
    );

    robot.respond(/close task (.*) - (.*)/i, function(response) {
        var ticketNumber = response.match[1];
        var closeComment = response.match[2];
        var updateParams;

        // Gets sys_id of ticket
        api.getRecordById(ticketNumber, function(err, result) {
            if (err) {
                response.send("Task not found, please try again");
                console.error(err);
                return;
            }
            else {
                
            }
        });
        
    });

};
