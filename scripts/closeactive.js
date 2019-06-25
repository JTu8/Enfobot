"use strict";

var api = require("servicenow-lite");
var path = require("path");
var close = require(path.resolve(__dirname, "./ticketupdate.js"));

module.exports = function (robot) {
    
    robot.respond(/close task (.*)/i, function(response) {
        var ticketNumber = robot.brain.get('task') || {};
        var closeComment = response.match[1];
        var closeParams;
        console.log(ticketNumber);

        if (robot.brain.get('task') == null) {
            response.send("No active task");
            response.send("Either active task by using Enfobot active <tasknumber command or use command Enfobot close task <tasknumber> - <close notes>")
        }
        else {
            // Gets sys_id of ticket
        api.getRecordById(ticketNumber, function(err, result) {
            if (err) {
                response.send("Task not found, please try again");
                console.error(err);
                return;
            }
            else {
                    var sysClass = result['sys_class_name'];
                    // Checks tasks class and updates incident_state
                    switch (result['dv_sys_class_name']) {
                        case 'Incident':
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
                        case 'Ticket':
                            closeParams = {
                                'sys_id': result.sys_id,
                                'close_notes': closeComment,
                                'state': 3
                            };
                            console.log(sysClass);
                            console.log("Close paramas= " + JSON.stringify(closeParams));
                            //Close ticket
                            close.updateTask(closeParams, ticketNumber, response);
                            response.send("Ticket " + ticketNumber + " closed");
                            break;
                        case 'Problem':
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
                        case 'Change Request':
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
                        case 'Change Task':
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
                        case 'Requested Item':
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
                        case 'Project Task':
                            closeParams = {
                                'sys_id': result.sys_id,
                                'close_notes': closeComment,
                                'state': 3
                            };
                            console.log(sysClass);
                            console.log("Close params=" + JSON.stringify(closeParams));
                            //Close ticket
                            close.updateTask(closeParams, ticketNumber, response);
                            response.send("Task " + ticketNumber + " closed");
                            break;
                            
                            
                    }
        
                    
                }
            });
        }

        
        
    });

};
