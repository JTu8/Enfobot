"use strict";

var api = require("servicenow-lite");
var underscore = require("underscore");


module.exports = function (robot) {
    
     robot.commands.push(
         "Enfobot assign <tasknumber> to <Person/Group> - Assigns task to person or group"
     );

     robot.respond(/assign (.*) to (.*)/i, function(response) {
        var ticketNumber = response.match[1];
        var person = response.match[2];
        var updateParams;

        //var prefix = ticketNumber.substring(0, 3);

        console.log("Ticket number= " + ticketNumber);
        console.log("Prefix= " + prefix);   
        console.log("Person= " + person);
    
        // Gets sys_id of ticket 
        api.getRecordById(ticketNumber, function(err, result) {
            if (err) {
                response.send("Task not found please try again");
                console.error(err);
                return;
            }
            else {
                updateParams = {
                    'sys_id': result.sys_id,
                    'assigned_to': person
                };
                console.log("Params= " + JSON.stringify(updateParams));

                // Assings ticket to user or group
                api.updateTicket(updateParams, prefix, function (err, result) {
                    if(err) {
                        response.send("Assigning failed, please try again");
                        console.error(err);
                        return;
                    }
                    else {
                        response.send("Task " + ticketNumber +  " assigned to " + person);
                        console.log(JSON.stringify(result));
                    }

                    
                });
            }
            
        });

    }); 
};



