"use strict";

var api = require("servicenow-lite");
var underscore = require("underscore");
var path = require("path");
var assign = require(path.resolve(__dirname, "./ticketassign.js"));

module.exports = function (robot) {
    
     robot.commands.push(
         "Enfobot assign <tasknumber> to person|group - <person|group> - Assigns task to person or group"
     );

     robot.respond(/assign (.*) to (.*) - (.*)/i, function(response) {
        var ticketNumber = response.match[1];
        //choices are person or group
        var choice = response.match[2];
        //persons or groups name
        var person = response.match[3];
        var updateParams;

        console.log("Ticket number= " + ticketNumber);  
        console.log("Person= " + person);

        // Gets sys_id of ticket 
        api.getRecordById(ticketNumber, function(err, result) {
            if (err) {
                response.send("Task not found please try again");
                console.error(err);
                return;
            }
            else {
                // Selects whether user types person or group
                switch(choice) {
                    case 'person':
                        updateParams = {
                            'sys_id': result.sys_id,
                            'assigned_to': person,
                        };
                        console.log("Params= " + JSON.stringify(updateParams));
                        break;
                    case 'group':
                        updateParams = {
                            'sys_id': result.sys_id,
                            'assignment_group': person,
                        };
                        console.log("Params= " + JSON.stringify(updateParams));
                        break;
                    default:
                        response.send("I did not understand that, please try again");
                }
                // Calls function that assigns ticket to user or group
                assign.updateTask(updateParams, ticketNumber, person, response);
             
            }
            
        });

    }); 
    
};



