"use strict";

module.exports = function(robot) {
    robot.commands.push(
        "Enfobot get all processes - Prints all processes"
    );

    robot.respond(/get all processes/i, function(response) {

        var accessToken = process.env['ACCESS_TOKEN'];
        const releasesUrl = process.env.UIPATH_ORCH_URL + "odata/Releases";
        const getJobUrl = process.env.UIPATH_ORCH_URL + "odata/Jobs/?&$filter=";
        const tenantName = process.env.X_UIPATH_TenantName;
        const organizaionIDUnit = process.env.X_UIPATH_OrganizationUnitId;

        robot.http(releasesUrl).headers({'Authorization': 'bearer '+ accessToken, 'X-UIPATH-TenantName': tenantName}).get()(function(err, res, body) {
            if(res.statusCode !== 200) {
                response.send("Error: " + body);
                console.log("Error:" + body);
                return;
            }
            else {
                var processes = [];
                processes = JSON.parse(body);
                console.log(processes);

                
                processes.value.map(item => {
                    
                    var releaseKey = item.ProcessKey;
                   
                    
                    robot.http(getJobUrl + 'ReleaseName eq ' + "'" + releaseKey + "'").headers({'Authorization': 'bearer '+ accessToken, 'X-UIPATH-TenantName': tenantName, 'X-UIPATH-OrganizationUnitId': organizaionIDUnit}).get()(function(err, res, body) {
                        if(res.statusCode !== 200) {
                            response.send("Error while getting Job data");
                            console.log("Error while getting Job data ",  + body);
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
        
    });
};
