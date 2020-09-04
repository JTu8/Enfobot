"use strict";


module.exports = function(robot) {
    robot.commands.push(
        "Enfobot start job <job name> with robot <robot name> - Starts specified job with specified robot"
    );

    robot.respond(/start job (.*) with robot (.*)/i, function(response) {
        var job = response.match[1];
        var robotName = response.match[2];

        const authenticateUrl = process.env.UIPATH_ORCH_URL + "api/account/authenticate";
        const robotsUrl = process.env.UIPATH_ORCH_URL + "odata/Robots";
        const releasesUrl = process.env.UIPATH_ORCH_URL + "odata/Releases";
        const jobStartUrl = process.env.UIPATH_ORCH_URL + "odata/Jobs/UiPath.Server.Configuration.OData.StartJobs";
        const getJobUrl = process.env.UIPATH_ORCH_URL + "odata/Jobs/?&$filter=";
        
        //Checks robots memory for tenant
        if(robot.brain.get('tenant') == null) {
            //If memory is empty tenant variable is set from Environment variable
            var tenant = process.env.TENANT_NAME;
            console.log(tenant);
        }
        else {
            tenant = robot.brain.get(tenant);
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
                console.log(err);
                return;
            }
            else {
                var token = JSON.parse(body);
                console.log('Bearer ' + token.result);

                var auth = 'Bearer ' + token.result;

                robot.http(releasesUrl + '?$filter=ProcessKey eq ' + "'" + job + "'").header('Authorization', auth).get()(function(err, res, body) {
                    if(res.statusCode !== 200) {
                        response.send("Error: " + err);
                        console.log("Error:" + err);
                        return;
                    }
                    else {
                        var releseases = JSON.parse(body);
                        console.log(releseases);
                        console.log("Job release key: " + releseases.value[0].Key);
                        var releaseKey = releseases.value[0].Key;
                        
                        robot.http(robotsUrl + '?$filter=Name eq ' + "'" + robotName + "'").header('Authorization', auth).get()(function(err, res, body) {
                            if(res.statusCode !== 200) {
                                response.send("Error: " + err);
                                console.log("Error:" + err);
                                return;
                            }
                            else {
                                var name = JSON.parse(body);
                                console.log(name);
                                console.log("Robot Id: " + name.value[0].Id);
                                var robotId = name.value[0].Id;

                            }

                            var startInfo;
                            startInfo = JSON.stringify(
                                {
                                    "startInfo": {
                                        "ReleaseKey": releaseKey,
                                        "Strategy": "Specific",
                                        "RobotIds": [ robotId ],
                                        "NoOfRobots": 0,
		                                "Source": "Manual"
                                    }
                                }
                            );

                            console.log(startInfo);

                            
                            //Starts requestet job
                            robot.http(jobStartUrl).header('Authorization', auth).header('Content-Type', 'application/json').post(startInfo)(function(err, res, body) {
                                if(res.statusCode !== 201) {
                                    response.send("Error: " + err);
                                    console.log("Error:" + err);
                                    return;
                                }
                                else {
                                    console.log(JSON.parse(body));
                                    var jobName = JSON.parse(body);
                                    response.send("Job " + jobName.value[0].ReleaseName + " started");

                                    var jobID = jobName.value[0].Id;
                                    console.log(jobID);

                                    request(1000000);
                                    
                                    function request(retries) {
                                        robot.http(getJobUrl + 'Id eq ' + jobID).header('Authorization', auth).get()(function(err, res , body) {
                                            if(res.statusCode !== 200) {
                                                response.send("Error: " + err);
                                                console.log("Error:" + err);
                                                return;     
                                            }
                                            else {
                                                var jobStatus = JSON.parse(body);
                                                if (jobStatus.value[0].State == 'Successful') {
                                                    response.send("Job was succesful");
                                                }
                                                else if(jobStatus.value[0].State == 'Faulted') {
                                                    response.send("Job faulted. Please check logs");
                                                }
                                                else {
                                                    if(retries > 0) {
                                                        request(--retries);
                                                    }
                                                    else {
                                                        console.log("Out of retries");
                                                    }
                                                }
                                            }
                                        });
                                    }    
                                
                                }
                            });
                            
                        });

                    }
                });

            }

        });

    });
};

