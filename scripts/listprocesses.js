"use strict";

module.exports = function(robot) {
    robot.commands.push(
        "Enfobot get all processes - Prints all processes"
    );

    robot.respond(/get all processes/i, function(response) {

        const authenticateUrl = process.env.UIPATH_ORCH_URL + "api/account/authenticate";
        const releasesUrl = process.env.UIPATH_ORCH_URL + "odata/Releases";
        const getJobUrl = process.env.UIPATH_ORCH_URL + "odata/Jobs/?&$filter=";

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
                response.send("Error: " + err);
                response.send("Check that you have correct Environment Variables. Please look Readme.md for guidance");
                console.log(err);
                return;
            }
            else {
                var token = JSON.parse(body);
                console.log('Bearer ' + token.result);

                var auth = 'Bearer ' + token.result;

                robot.http(releasesUrl).header('Authorization', auth).get()(function(err, res, body) {
                    if(res.statusCode !== 200) {
                        response.send("Error: " + err);
                        console.log("Error:" + err);
                        return;
                    }
                    else {
                        var processes = [];
                        processes = JSON.parse(body);
                        console.log(processes);

                        
                        processes.value.map(item => {
                            
                            var releaseKey = item.ProcessKey;
                            var environmentName = item.EnvironmentName;

                            var releaseName = releaseKey + "_" + environmentName;

                            robot.http(getJobUrl + 'ReleaseName eq ' + "'" + releaseName + "'").header('Authorization', auth).get()(function(err, res, body) {
                                if(res.statusCode !== 200) {
                                    response.send("Error while getting Job data");
                                    console.log("Error while getting Job data ",  + err);
                                    return;
                                }
                                else {
                                    var jobStatus = JSON.parse(body);
                                    //console.log(jobStatus);
                                    for (var i in jobStatus.value) {
                                        var startTime = jobStatus.value[i].StartTime;
                                        var endTime = jobStatus.value[i].EndTime;
                                        var state = jobStatus.value[i].State;
                                        var info = jobStatus.value[i].Info;
                                        var inputArguments = jobStatus.value[i].InputArguments;
                                        var outPutArguments = jobStatus.value[i].OutputArguments;
                                    }


                                    console.log("Prosessit: " + item.ProcessKey);
                                    response.send({
                                        "attachments": [
                                            {
                                                "blocks": [
                                                    {
                                                        "type": "header",
                                                        "text": {
                                                            "type": "plain_text",
                                                            "text": ":desktop_computer:"
                                                        }
                                                    },
                                                    {
                                                        "type": "section",
                                                        "text": {
                                                            "type": "mrkdwn",
                                                            "text": "*Process name :* " + item.ProcessKey  + "\n" + "*Process Id:* " + item.Id + 
                                                                    "\n" + "<" + process.env.UIPATH_ORCH_URL + "monitoring/jobs/" + item.Id + "|Jobs data>"
                                                        }
                                                    },
                                                    {
                                                        "type": "divider"
                                                    },
                                                    {
                                                        "type": "section",
                                                        "text": {
                                                            "type": "plain_text",
                                                            "text": "Data from latest process run"
                                                        }
                                                    },  
                                                    {
                                                        "type": "section",
                                                        "text": {
                                                            "type": "mrkdwn",
                                                            "text":  "*Start time:* " + startTime + "\n" + "*End time:* " + endTime + "\n" + "*State:* " + state + "\n" + 
                                                                    "*Info:* " + info + "\n" + "*Input arguments:* " + inputArguments + "\n" + 
                                                                    "*Output arguments:* " + outPutArguments
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
