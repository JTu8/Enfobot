"use strict";


//Lists all robots from selected tenant
module.exports = function(robot) {
    robot.commands.push(
        "Enfobot get all robots - Prints info about all robots"
    );

    
    robot.respond(/get all robots/i, function(response) {

        //Gets necessary environment variables
        var accessToken = process.env['ACCESS_TOKEN'];
        const robotsUrl = process.env.UIPATH_ORCH_URL + "odata/Robots";
        const availableUrl = process.env.UIPATH_ORCH_URL + "odata/Sessions?$filter=";
        const tenantName = process.env.X_UIPATH_TenantName;
        const organizaionIDUnit = process.env.X_UIPATH_OrganizationUnitId;

        console.log(robotsUrl);

        
        robot.http(robotsUrl).headers({'Authorization': 'bearer '+ accessToken, 'X-UIPATH-TenantName': tenantName, 'X-UIPATH-OrganizationUnitId': organizaionIDUnit}).get()(function(err, res, body) {
        if(res.statusCode !== 200) {
            response.send("Something went wrong");
            console.log("Error:" + err);
            return;
        }
        else {
            var robots = [];
            robots = JSON.parse(body);
            console.log(robots);
            
            response.send("Robots data and availability");
            
            robots.value.map(item => {
                console.log("Robots: " + item.Name);
                console.log("ID:"  + item.Id);

                robot.http(availableUrl + 'Robot/Id eq ' + item.Id).headers({'Authorization': 'bearer '+ accessToken, 'X-UIPATH-TenantName': tenantName, 'X-UIPATH-OrganizationUnitId': organizaionIDUnit}).get()(function(err, res, body) {
                    if(res.statusCode !== 200) {
                        response.send("Something went wrong");
                        console.log("Error:" + body);
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
         

    });

};
