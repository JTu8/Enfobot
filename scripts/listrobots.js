"use strict";


module.exports = function(robot) {
    robot.commands.push(
        "Enfobot get all robots - Prints info about all robots"
    );

    
    robot.respond(/get all robots/i, function(response) {

        
        const authenticateUrl = process.env.UIPATH_ORCH_URL + "api/account/authenticate";
        const robotsUrl = process.env.UIPATH_ORCH_URL + "odata/Robots";

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
                        
                        robots.value.map(item => {
                            console.log("Robots: " + item.Name);
                            console.log("ID:"  + item.Id);
                            console.log("Machine host name: " + item.MachineName);
                            response.send("Robots name: " + item.Name + "\n" + "Robots Id: " + item.Id + "\n" + "Machine hostname: " + item.MachineName);
                        });


                        
                    }
                });
            }
        });

        

    });

};
