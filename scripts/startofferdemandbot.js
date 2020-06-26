"use strict";

module.exports = function(robot) {
    robot.commands.push(
        "Enfobot fill this Excel for me <Excel filename without extension> - Fills selected offer Excel"
        );

    robot.respond(/fill this Excel for me (.*)/i, function(response) {
        var excelFile = response.match[1];

        

        const authenticateUrl = process.env.UIPATH_ORCH_URL + "api/account/authenticate";
        const jobStartUrl = process.env.UIPATH_ORCH_URL + "odata/Jobs/UiPath.Server.Configuration.OData.StartJobs";
        const getJobUrl = process.env.UIPATH_ORCH_URL + "odata/Jobs/?&$filter=";

        var tenant = process.env.TENANT_NAME;
        console.log(tenant);

        var username = process.env.UIPATH_USERNAME;
        console.log(username);

        var password = process.env.UIPATH_PASSWORD;
        console.log(password);

        var robotID = process.env.UIPATH_ROBOTID;
        console.log(robotID);

       var parsedID = parseInt(robotID);


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

                var startInfo;
                startInfo = JSON.stringify(
                    {
                        "startInfo": {
                            "ReleaseKey": "27120fa6-fb25-4a64-b804-f67db42b07ee",
                            "Strategy": "Specific",
                            "RobotIds": [ parsedID ],
                            "NoOfRobots": 0,
                            "Source": "Manual",
                            "InputArguments": "{\"Workbook\":\"" + excelFile + "\"}"
                        }
                    }
                );

                console.log(startInfo);

                robot.http(jobStartUrl).header('Authorization', auth).header('Content-Type', 'application/json').post(startInfo)(function(err, res, body) {
                    if(res.statusCode !== 201) {
                        response.send("Error: " + err);
                        console.log("Error:" + err);
                        return;
                    }
                    else {
                        console.log(JSON.parse(body));
                        response.send("Robot execution started. File " + excelFile + " is being filled");

                        var job = JSON.parse(body);
                        var jobID = job.value[0].Id;
                        console.log(jobID);

                        request(1000000);

                        function request(retries) {
                            robot.http(getJobUrl + 'Id eq ' + jobID).header('Authorization', auth).get()(function(err, res, body) {
                                if(res.statusCode !== 200) {
                                    response.send("Error: " + err);
                                    console.log("Error:" + err);
                                    return;     
                                }
                                else {
                                    var jobStatus = JSON.parse(body);
                                    if(jobStatus.value[0].State == 'Successful') {
                                        response.send("Job was successful");
                                    }
                                    else if(jobStatus.value[0].State == 'Faulted') {
                                        response.send("Job faulted. Please check logs");
                                    }
                                    else {
                                        if(retries > 0 ) {
                                            request(-- retries);
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
            }
        });

    });
};
