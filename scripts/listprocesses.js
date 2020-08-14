"use strict";

module.exports = function(robot) {
    robot.commands.push(
        "Enfobot get all processes - Prints all processes"
    );

    robot.respond(/get all processes/i, function(response) {

        const authenticateUrl = process.env.UIPATH_ORCH_URL + "api/account/authenticate";
        const releasesUrl = process.env.UIPATH_ORCH_URL + "odata/Releases";

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
                            console.log("Prosessit: " + item.ProcessKey);
                            response.send(item.ProcessKey);
                        });
                       
                    
                        
                    }
                });
            }
        });

    });
};
