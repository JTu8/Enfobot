"use strict";

var api = require("servicenow-lite");
var prettyjson = require("prettyjson");

module.exports = function(robot) {
    robot.commands.push(
        "Enfobot create <prefix> with <Short description> - Creates a new ticket"
    );
    // Creates a new ticket
    robot.respond(/create (.*) with (.*)/i, function(response) {
        var prefix = response.match[1];
        var shortDescription = response.match[2];

        var params = {
            'short_description': shortDescription
        }

        api.createTicket(params, prefix, function(err, result) {
            if (err) {
                response.send("Ticket creation failed");
                console.error(err);
                return;
            }
            else {
                response.send("New ticket created");
                response.send(result['number']);
                console.log(JSON.stringify(result));
            }
        });
    });
};