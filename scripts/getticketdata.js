"use strict";

var api = require("servicenow-lite");
const path = require("path");
var link = require(path.resolve(__dirname, "./link.js"));


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
            };

            var sysID = result.assigned_to;
            console.log("users sys_id= " + sysID);

            //Checks if assigned_to is empty
            if (searchResult['assigned_to'].length === 0) {
                console.log("Assigned to is null");
                console.log(JSON.stringify(searchResult));
                response.send("Task number: " + searchResult['number'] + "\n" + "Short description: " + 
                            searchResult['short_description'] + "\n" + "Assigned to: " + searchResult['assigned_to'] + 
                            "\n" + "Link: " + link.urlDirect(taskNumber));   
            }
            else {
                //If task is assigned to someone then call function that finds user by sys_id
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
                                    "\n" + "Link: " + link.urlDirect(taskNumber));
                                    
                    }
                });
                
            }
            
            
            
        }
    });

    return searchResult;
}

module.exports = {
    getTicketData: getTicketData
}
