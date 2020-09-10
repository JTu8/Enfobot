"use strict";

//This tests authenticating method
module.exports = function(robot) {
    robot.commands.push(
        "Enfobot authenticate to UiPath - Authenticates to UiPath Orchestrator"
    );

    //Tähän cloud kutsu
    robot.respond(/authenticate to UiPath/i, function(response) {

        console.log("test");

        /*

        const authenticateUrl = process.env.AUTH_URL;
        
        var data;
        data = JSON.stringify(
            {
                "grant_type": "refresh_token",
	            "client_id": process.env.CLIENT_ID,
	            "refresh_token": process.env.REFRESH_TOKEN
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
                console.log(JSON.parse(body));
                var token = JSON.parse(body);
                console.log(token);
                
                console.log(token.result);
                response.send("Bearer token is: " + token.result);
                response.send("Remember that bearer token expires after 30 minutes!");
                
                
            }
        
        });

*/
        

    });
};
