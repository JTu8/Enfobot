"use strict";
var axios = require("axios");

//This function authenticates to UiPath Orchestrator and refreshes the access token every 24 hours
//The access token is set in environmnent variable called ACCESS_TOKEN
function timeOutAuth() {
    const authenticateUrl = process.env.API_AUTH_URL;
    
    var data;
    data = JSON.stringify(
        {
            "grant_type": "refresh_token",
            "client_id": process.env.CLIENT_ID,
            "refresh_token": process.env.REFRESH_TOKEN
        }
    );
    console.log(data);

    const headers = {
        'Content-Type': 'application/json'
    }

    var accessToken;

    axios.post(authenticateUrl, data, {headers: headers})
        .then(res => {
            //console.log(res.data);
            accessToken = res.data.access_token;
            console.log(accessToken);
            var date = (new Date());
            console.log("Access token refreshed in " + date);
            process.env['ACCESS_TOKEN'] = accessToken
        }).catch((error) => {
            console.log(error);
        });


        
}

setInterval(timeOutAuth, 60000);

