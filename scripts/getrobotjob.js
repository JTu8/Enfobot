"use strict";

const { weekdaysMin } = require("moment");

module.exports = function(robot) {
    robot.commands.push(
        "Enfobot get job <job name> status - Prints status of a selected job"
    );

    robot.respond(/get job (.*) status/i, function(response) {
        var job = response.match[1];

        const authenticateUrl = process.env.UIPATH_ORCH_URL + "api/account/authenticate";
        const robotsUrl = process.env.UIPATH_ORCH_URL + "odata/Robots";
        const releasesUrl = process.env.UIPATH_ORCH_URL + "odata/Releases";
        const getJobUrl = process.env.UIPATH_ORCH_URL + "odata/Jobs/?&$filter=";

        var tenant = process.env.TENANT_NAME;
        console.log(tenant);

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
                response.send("Error while authenticating");
                console.log("Error while authenticating: " + err);
                return;
            }
            else {
                var token = JSON.parse(body);
                console.log('Bearer ' + token.result);

                var auth = 'Bearer ' + token.result;

                robot.http(releasesUrl + '?$filter=ProcessKey eq ' + "'" + job + "'").header('Authorization', auth).get()(function(err, res, body) {
                    if(res.statusCode !== 200) {
                        response.send("Error while getting Release name");
                        console.log("Error while getting Release name " + err);
                        return;
                    }
                    else {
                        var release = JSON.parse(body);
                        console.log(release);
                        console.log("Job Process key: " + release.value[0].ProcessKey);
                        console.log("Job Environment name: " + release.value[0].EnvironmentName);
                        var releaseKey = release.value[0].ProcessKey;
                        var environmentName = release.value[0].EnvironmentName;
                        var id = release.value[0].Id;
                        var releaseName = releaseKey + "_" + environmentName;
                        console.log("Job release name: " + releaseName);

                        robot.http(getJobUrl + 'ReleaseName eq ' + "'" + releaseName + "'").header('Authorization', auth).get()(function(err, res, body) {
                            if(res.statusCode !== 200) {
                                response.send("Error while getting Job data");
                                console.log("Error while getting Job data ",  + err);
                                return;
                            }
                            else {
                                var jobStatus = JSON.parse(body);
                                console.log(jobStatus);
                                for (var i in jobStatus.value) {
                                    var startTime = jobStatus.value[i].StartTime;
                                    var endTime = jobStatus.value[i].EndTime;
                                    var state = jobStatus.value[i].State;
                                    var info = jobStatus.value[i].Info;
                                    var inputArguments = jobStatus.value[i].InputArguments;
                                    var outPutArguments = jobStatus.value[i].OutputArguments;
                                }

                                
                               response.send({
                                "attachments": [
                                    {
                                        "blocks": [
                                            {
                                                "type": "header",
                                                "text": {
                                                    "type": "plain_text",
                                                    "text": "Status for job : " + job 
                                                }
                                            },
                                            {
                                                "type": "section",
                                                "text": {
                                                    "type": "mrkdwn",
                                                    "text": "<" + process.env.UIPATH_ORCH_URL + "monitoring/jobs/" + id + "|Jobs data>" + "\n" + 
                                                            ":desktop_computer:" + "\n" + 
                                                            "*Start time:* " + startTime + "\n" + "*End time:* " + endTime + "\n" + 
                                                            "*State:* " + state + "\n" + "*Info:* " + info + "\n" + "*Input arguments:* " + inputArguments + "\n" + 
                                                            "*Output arguments:* " + outPutArguments
                                                }
                                            }
                                            
                                        ]
                                    }]
                                });
                            }
                        });
                    }
                });
            }
        });
    });
};
