"use strict";

var api = require("servicenow-lite");
// All functions that are used to update fields if tasks uses this function 
function updateTask(updateParams, ticketNumber, response) {
    
    // Updates ticket
    api.updateTicket(updateParams, ticketNumber, function (err, result) {
        if(err) {
            response.send("Something went wrong, please try again");
            console.error(err);
            return;
        }
        else {
            console.log(JSON.stringify(result));
        }
    });
   
}

module.exports = {
    updateTask: updateTask
};
