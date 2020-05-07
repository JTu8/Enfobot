"use strict";

var api = require("servicenow-lite");
var path = require("path");
var assign = require(path.resolve(__dirname, "./ticketupdate.js"));

module.exports = function (robot) {
    
     robot.commands.push(
         "Enfobot assign <tasknumber> to person/group <person|group> - Assigns task to person or group."
     );
    // Assigns ticket to selected person
     robot.respond(/assign (.*) to person (.*)/i, function(response) {
        var ticketNumber = response.match[1];
        var person = response.match[2];
        var updateParams;

        console.log("Ticket number= " + ticketNumber);  
        

        // Get user by name
        api.getUserName(person, function(err, result) {
            if (err) {
                response.send("Something went wrong, please try again");
                console.error(err);
            }
            else {
                if (result === undefined) {
                    console.log("Not found");
                    response.send("User was not found, please try again");
                }
                else {
                    // assign person variable to persons sys_id
                    person = result['sys_id'];
                    // This is just used to print persons name
                    var assignedTo = result['name'];
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
                                'dv_company': 'Enfo Oy'
                            };
                            console.log("Params= " + JSON.stringify(updateParams));
                            
                            // Calls function that updates assigned_to field 
                            assign.updateTask(updateParams, ticketNumber, response);
                            response.send("Task " + ticketNumber +  " assigned to " + assignedTo);
                            
                            
                        }
            
             
                    });
                }
            }
            
        });

        

    }); 
    
};



