"use strict";

var api = require("servicenow-lite");

module.exports = function (robot) {
    robot.commands.push(
        "Enfobot find <search param> - Find data"
    );

    robot.respond(/find (.*)/i, function (response) {
        var taskNumber = response.match[1];
        var searchResult;
        
        api.search(taskNumber, function(err, result) {
            if (err) {
                response.send("Records were not found");
                console.error(err);
            }
            else {
                response.send("Your search results");
                response.send(JSON.stringify(result));
                console.log(JSON.stringify(result));
                
            }
        });
        

        
        
    
    });
};
