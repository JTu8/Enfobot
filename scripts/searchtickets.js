"use strict";

//var api = require("servicenow-lite");
//var prettyJson = require("prettyjson");
var path = require("path");
var get = require(path.resolve(__dirname, "./getticketdata.js"));


module.exports = function (robot) {
    robot.commands.push(
        "Enfobot search <task number> - Prints info about task"
    );
    
    // Searches recrods by task number
    robot.respond(/search (.*)/i, function (response) {
        var taskNumber = response.match[1];

        get.getTicketData(taskNumber, response);
        
    
    });
};
