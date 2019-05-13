"use strict";

var api = require("servicenow-lite");
var prettyJson = require("prettyjson");


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
        
        api.getRecordById(taskNumber, function(err, result) {
            if (err) {
                response.send("Task not found, please try again");
                console.error(err);
            }
            else {
                
                searchResult = {
                    'number': result.number,
                    'short_description': result.short_description,
                    'assigned_to': result.assigned_to,
                    'assignment_group': result.assignment_group
                };

                console.log(JSON.stringify(searchResult));
                response.send(prettyJson.render(searchResult));
            }
        });
        
    
    });
};
