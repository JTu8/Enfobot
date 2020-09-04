"use strict";

module.exports = function(robot) {
    robot.commands.push(
        "Enfobot get available robots - Prints list of available robots"
    );

    robot.respond(/get available robots/i, function(response) {

        const authenticateUrl = process.env.UIPATH_ORCH_URL + "api/account/authenticate";
        const availableUrl = process.env.UIPATH_ORCH_URL + "odata/Sessions?$filter=State eq 'Available'";
        const robotsUrl = process.env.UIPATH_ORCH_URL + "odata/Robots/";

        //Checks robots memory for tenant
        if(robot.brain.get('tenant') == null) {
            //If memory is empty tenant variable is set from Environment variable
            var tenant = process.env.TENANT_NAME;
            console.log(tenant);
        }
        else {
            tenant = robot.brain.get('tenant');
            console.log(tenant);
        }

        
        var username = process.env.UIPATH_USERNAME;
        console.log(username);

        var password = process.env.UIPATH_PASSWORD;
        console.log(password);

        var data;
        data = JSON.stringify(
            {
                "tenancyName": tenant,
	            "usernameOrEmailAddress": username,
	            "password": password
            }
        );
        console.log(data);

        robot.http(authenticateUrl).header('Content-Type', 'application/json').post(data)(function(err, res, body) {
            if(res.statusCode !== 200) {
                response.send("Something went wrong while authenticating.");
                console.log(err);
                return;
            }
            else {
                var token = JSON.parse(body);
                console.log('Bearer ' + token.result);

                var auth = 'Bearer ' + token.result;

                robot.http(availableUrl).header('Authorization', auth).get()(function(err, res, body) {
                    if(res.statusCode !== 200) {
                        response.send("Error: " + err);
                        console.log("Error:" + err);
                        return;
                    }
                    else {
                        var availableRobots = [];
                        availableRobots = JSON.parse(body);
                        console.log(availableRobots);

                        availableRobots.value.map(item => {
                            console.log("Id: " + item.Id);

                            robot.http(robotsUrl + "?&$filter=Id eq " + item.Id).header('Authorization', auth).get()(function(err, res, body) {
                                if(res.statusCode !== 200) {
                                    //response.send("Error: " + err);
                                    console.log("Error:" + err);
                                    return;
                                }
                                else {
                                    var robots = [];
                                    robots = JSON.parse(body);
                                    console.log(robots);
                                    
                                    robots.value.map(item => {
                                        console.log("Robots: " + item.Name);
                                        console.log("ID:"  + item.Id);
                                        response.send({
                                            "attachments": [
                                                {
                                                    "blocks": [
                                                        {
                                                            "type": "header",
                                                            "text": {
                                                                "type": "plain_text",
                                                                "text": ":robot_face:"
                                                            }
                                                        },
                                                        {
                                                            "type": "section",
                                                            "text": {
                                                                "type": "mrkdwn",
                                                                "text": "*Robot name :* " + item.Name + "\n" + "*ID :* " + item.Id + "\n" + "*Type :* " + item.Type + 
                                                                        "\n" + "*Environment :* " + item.RobotEnvironments + 
                                                                        "\n" + "<" + process.env.UIPATH_ORCH_URL + "monitoring/robots/" + item.Id + "|Robots data>"
                                                            }
                                                        }
                                                        
            
                                                    ]
                                                }]
                                        })
                                    });
                                }
                            });
                            
                        });
                    }
                });
            }
        });

    });
};
