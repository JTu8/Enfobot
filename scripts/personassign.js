"use strict";

var api = require("servicenow-lite");
var path = require("path");
var assign = require(path.resolve(__dirname, "./ticketupdate.js"));

module.exports = function (robot) {
    
     robot.commands.push(
         "Enfobot assign <tasknumber> to person/group <person|group> - Assigns task to person or group"
     );

     robot.respond(/assign (.*) to person (.*)/i, function(response) {
        var ticketNumber = response.match[1];
        var person = response.match[2];
        var updateParams;

        console.log("Ticket number= " + ticketNumber);  
        console.log("Person= " + person);

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
                    'assigned_to': person,
                };
                console.log("Params= " + JSON.stringify(updateParams));

                // Calls function that assigns ticket to user 
                 assign.updateTask(updateParams, ticketNumber, response);
                 response.send("Task " + ticketNumber +  " assigned to " + person);

            }
            
             
        });

    }); 
    
};



