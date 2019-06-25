"use strict";

var api = require("servicenow-lite");

module.exports = function (robot) {
    
    // Searches data for ticket and gives you all the fields of searched ticket
    robot.respond(/find (.*)/i, function (response) {
        var taskNumber = response.match[1];
        
        api.search(taskNumber, function(err, result) {
            if (err) {
                response.send("Records were not found");
                console.error(err);
            }
            else {
                response.send("Your search results");
                console.log(result);
                response.send(JSON.stringify(result));
                
            }
        }); 
    
    });
};
