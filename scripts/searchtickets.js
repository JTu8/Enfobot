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
        var searchResult;
        /*
        api.search(taskNumber, function(err, result) {
            if (err) {
                response.send("Records were not found");
                console.error(err);
            }
            else {
                response.send("Your search results");
                console.log(prettyJson.render(result));
                
            }
        });
        */

        get.getTicketData(taskNumber, response);
        
    
    });
};
