"use strict";

var api = require("servicenow-lite");
var path = require("path");
var close = require(path.resolve(__dirname, "./ticketupdate.js"));

module.exports = function (robot) {
    robot.commands.push(
        "Enfobot close task <tasknumber> - <comments>"
    );

    robot.respond(/close task (.*) - (.*)/i, function(response) {
        var ticketNumber = response.match[1];
        var closeComment = response.match[2];
        var closeParams;

        // Gets sys_id of ticket
        api.getRecordById(ticketNumber, function(err, result) {
            if (err) {
                response.send("Task not found, please try again");
                console.error(err);
                return;
            }
            else {
                var sysClass = result['sys_class_name'];
                // Checks what is tasks class and updates incident_state
                switch (result['sys_class_name']) {
                    case 'incident':
                        closeParams = {
                            'sys_id': result.sys_id,
                            'close_notes': closeComment,
                            'incident_state': 6
                        };
                        console.log(sysClass);
                        console.log("Close paramas= " + JSON.stringify(closeParams));
                        //Close ticket
                        close.updateTask(closeParams, ticketNumber, response);
                        response.send("Ticket " + ticketNumber + " closed");
                        break;
                    case 'ticket':
                        closeParams = {
                            'sys_id': result.sys_id,
                            'close_notes': closeComment,
                            'state': 7
                        };
                        console.log(sysClass);
                        console.log("Close paramas= " + JSON.stringify(closeParams));
                        //Close ticket
                        close.updateTask(closeParams, ticketNumber, response);
                        response.send("Ticket " + ticketNumber + " closed");
                        break;
                    case 'problem':
                        closeParams = {
                            'sys_id': result.sys_id,
                            'close_notes': closeComment,
                            'problem_state': 4
                        };
                        console.log(sysClass);
                        console.log("Close paramas= " + JSON.stringify(closeParams));
                        //Close ticket
                        close.updateTask(closeParams, ticketNumber, response);
                        response.send("Task " + ticketNumber + " closed");
                        break;
                    case 'change_request':
                        closeParams = {
                            'sys_id': result.sys_id,
                            'close_notes': closeComment,
                            'state': 3
                        };
                        console.log(sysClass);
                        console.log("Close paramas= " + JSON.stringify(closeParams));
                        //Close ticket
                        close.updateTask(closeParams, ticketNumber, response);
                        response.send("Task " + ticketNumber + " closed");
                        break;
                    case 'change_task':
                        closeParams = {
                            'sys_id': result.sys_id,
                            'close_notes': closeComment,
                            'state': 3
                        };
                        console.log(sysClass);
                        console.log("Close paramas= " + JSON.stringify(closeParams));
                        //Close ticket
                        close.updateTask(closeParams, ticketNumber, response);
                        response.send("Task " + ticketNumber + " closed");
                        break;
                    case 'sc_rec_item':
                        closeParams = {
                            'sys_id': result.sys_id,
                            'close_notes': closeComment,
                            'state': 3
                        };
                        console.log(sysClass);
                        console.log("Close paramas= " + JSON.stringify(closeParams));
                        //Close ticket
                        close.updateTask(closeParams, ticketNumber, response);
                        response.send("Task " + ticketNumber + " closed");
                        break;
                    case 'pm_project_task':
                        closeParams = {
                            'sys_id': result.sys_id,
                            'close_notes': closeComment,
                            'state': 3
                        };
                        console.log(sysClass);
                        console.log("Close params=" + JSON.stringify(closeParams));
                        //Close ticket
                        close.updateTask(closeParams, ticketNumber, response);
                        
                        
                }
       
                
            }
        });
        
    });

};
