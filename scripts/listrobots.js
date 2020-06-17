"use strict";
var fs = require('fs');
var configPath = './config.json';



module.exports = function(robot) {
    robot.commands.push(
        "Enfobot get all robots - Prints info about all robots"
    );

    
    robot.respond(/get all robots/i, function(response) {

        var parsed = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

        const authenticateUrl = parsed.baseurl + "api/account/authenticate";
        const robotsUrl = parsed.baseurl + "odata/Robots";

        var data;
        data = JSON.stringify(
            {
                "tenancyName": "Default",
	            "usernameOrEmailAddress": parsed.usernameOrEmailAddress,
	            "password": parsed.password
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
                console.log('Bearer ' + token.result);

                var auth = 'Bearer ' + token.result;

                robot.http(robotsUrl).header('Authorization', auth).get()(function(err, res, body) {
                    if(res.statusCode !== 200) {
                        response.send("Error: " + err);
                        console.log("Error:" + err);
                        return;
                    }
                    else {
                        var robots = JSON.parse(body);
                        for (var i in robots.value) {
                            var robotNames = robots.value[i].Name;
                            response.send(robotNames);
                        }

                        
                        
                        
                    }
                });
            }
        });

        

    });

};
