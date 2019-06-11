"use strict";

var api = require("servicenow-lite");
var path = require("path");
var update = require(path.resolve(__dirname, "./ticketupdate.js"));


module.exports = function(robot) {
    //Comments task that has been saved to memory
    robot.respond(/give comment (.*)/i, function(response) {
        var comment = response.match[1];

        //Gets saved task from memory
        var taskNumber = robot.brain.get('task') || {};
        console.log(taskNumber);

        if (robot.brain.get('task') == null) {
            response.send("No active tasks");
            response.send("Either active task with Enfobot active <tasknumber> or comment task with " + 
                            "Enfobot comment <tasknumber> - <comment>");
        }
        else {
            // Gets sys_id of saved task
            api.getRecordById(taskNumber, function(err, result) {
                if (err) {
                    response.send("Task was not found, please try again");
                    console.error(err);   
                }
                else {
                    var assignParams = {
                        'sys_id': result.sys_id,
                        'work_notes': comment
                    }
                    console.log("Params= " + JSON.stringify(assignParams));
                    update.updateTask(assignParams, taskNumber, response);
                    response.send("Comments added to task " + taskNumber);
                    
                }
            });
        }
    });
};
