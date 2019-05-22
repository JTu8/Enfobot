"use strict";

var api = require("servicenow-lite");

function getTicketData (taskNumber, response) {
    var taskNumber;
    var searchResult;

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

            var sysID = result.assigned_to;
            console.log("sys_id= " + sysID);
     
            api.getUserByID(sysID, function(err, result) {
                if (err) {
                    response.send("sys_id was not found, please try again");
                    console.error(err);
                    return;
                }
                else {
                    console.log(JSON.stringify(searchResult));
                    response.send("Task number: " + searchResult['number'] + "\n" + "Short description: " + 
                                searchResult['short_description'] + "\n" + "Assigned to: " + result['name'] + 
                                "\n" + "Assignment group: " + searchResult['assignment_group']);
                }
            });
        
            
            
        }
    });

    return searchResult;
}

module.exports = {
    getTicketData: getTicketData
}