"use strict";
var fs = require('fs');
var configPath = './config.json';

module.exports = function(robot) {
    robot.commands.push(
        "Enfobot fill this Excel for me <Excel filename without extension> - Fills selected offer Excel"
        );

    robot.respond(/fill this Excel for me (.*)/i, function(response) {
        var excelFile = response.match[1];

        var parsed = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

        const authenticateUrl = parsed.baseurl + "api/account/authenticate";
        const jobStartUrl = parsed.baseurl + "odata/Jobs/UiPath.Server.Configuration.OData.StartJobs";
        const getJobUrl = parsed.baseurl + "odata/Jobs/?&$filter=";

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

                var startInfo;
                startInfo = JSON.stringify(
                    {
                        "startInfo": {
                            "ReleaseKey": "27120fa6-fb25-4a64-b804-f67db42b07ee",
                            "Strategy": "Specific",
                            "RobotIds": [ 9 ],
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
