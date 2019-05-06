"use strict";

var api = require("servicenow-lite");
var prettyJson = require("prettyjson");


module.exports = function (robot) {
    robot.commands.push(
        "Enfobot search <query> - Searches records"
    );

    // Searches recrods by query
    robot.respond(/search (.*)/i, function (response) {
        var searchQuery = response.match[1];

        api.search(searchQuery, function(err, result) {
            if (err) {
                response.send("Records were not found");
                console.error(err);
            }
            else {
                response.send("Your search results");
                //console.log(prettyJson.render(result));
                response.send(prettyJson.render(result));
            }
        });
    });
};