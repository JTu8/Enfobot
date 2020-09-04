"use strict";

//Lists all robots from selected tenant
module.exports = function(robot) {
    robot.commands.push(
        "Enfobot get all robots - Prints info about all robots"
    );

    
    robot.respond(/get all robots/i, function(response) {

        
        const authenticateUrl = process.env.UIPATH_ORCH_URL + "api/account/authenticate";
        const robotsUrl = process.env.UIPATH_ORCH_URL + "odata/Robots";
        const availableUrl = process.env.UIPATH_ORCH_URL + "odata/Sessions?$filter=";

        //Checks robots memory for tenant
        if(robot.brain.get('tenant') == null) {
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

                robot.http(robotsUrl).header('Authorization', auth).get()(function(err, res, body) {
                    if(res.statusCode !== 200) {
                        response.send("Error: " + err);
                        console.log("Error:" + err);
                        return;
                    }
                    else {
                        var robots = [];
                        robots = JSON.parse(body);
                        console.log(robots);
                        
                        response.send("All robots from tenant: " + tenant);

                        robots.value.map(item => {
                            console.log("Robots: " + item.Name);
                            console.log("ID:"  + item.Id);

                            robot.http(availableUrl + 'Id eq ' + item.Id).header('Authorization', auth).get()(function(err, res, body) {
                                if(res.statusCode !== 200) {
                                    response.send("Error: " + err);
                                    console.log("Error:" + err);
                                    return;
                                }
                                else {
                                    var robotStatus = JSON.parse(body);

                                    for(var i in robotStatus.value) {
                                        var state = robotStatus.value[i].State;
                                    }
                                    console.log(state);

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
                                                            "text": "<" + process.env.UIPATH_ORCH_URL + "monitoring/robots/" + item.Id + "|Robots data>" + "\n" +
                                                                    "*Robot name :* " + item.Name + "\n" + "*ID :* " + item.Id + "\n" + "*Type :* " + item.Type + 
                                                                    "\n" + "*Environment :* " + item.RobotEnvironments + "\n" + "*State: * " + state 
                                                             
                                                        }
                                                    }
                                                    
        
                                                ]
                                            }]
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
