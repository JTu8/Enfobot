"use strict";

var api = require("servicenow-lite");

function updateTask(updateParams, ticketNumber, person, response) {
    
    // Updates ticket
    api.updateTicket(updateParams, ticketNumber, function (err, result) {
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

module.exports = {
    updateTask: updateTask
};
