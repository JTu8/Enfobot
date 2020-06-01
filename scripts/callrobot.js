"use strict";

const authenticateUrl = "";

module.exports = function(robot) {
    robot.commands.push(
        "Enfobot authenticate to UiPath - Authenticates to UiPath Orchestrator"
    );

    robot.respond(/authenticate to UiPath/i, function(response) {

        var data;
        data = JSON.stringify(
            {
                "tenancyName": "Default",
	            "usernameOrEmailAddress": "",
	            "password": ""
            }
        );
        console.log(data);

        robot.http(authenticateUrl).header('Content-Type', 'application/json').post(data)(function(err, res, body) {
            if(res.statusCode !== 200) {
                response.send("Error: " + err);
                console.log(err);
                return;
            }
            else {
                console.log(JSON.parse(body));
                var token = JSON.parse(body);
                console.log(token.result);
                response.send("Bearer token is: " + token.result);
                response.send("Remember that bearer token expires after 30 minutes!");
                
            }
        });


        

    });
};
