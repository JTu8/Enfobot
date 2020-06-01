"use strict";

const authenticateUrl = "";
const robotsUrl = "";

module.exports = function(robot) {
    robot.commands.push(
        "Enfobot get all robots - Prints info about all robots"
    );

    
    robot.respond(/get all robots/i, function(response) {

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
                var token = JSON.parse(body);
                console.log(token.result);

                robot.http(robotsUrl).headers('Authorization', 'Bearer ' + token.result).get()(function(err, res, body) {
                    if(res.statusCode !== 200) {
                        response.send("Error: " + err);
                        console.log("Error:" + err);
                        return;
                    }
                    else {
                        console.log(JSON.parse(body));
                        var robots = JSON.parse(body);
                        console.log(robots);
                        response.send("All robots from Default tenant: " + robots);
                    }
                });
            }
        });

        

    });

};
