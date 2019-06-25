"use strict";

var api = require("servicenow-lite");
const path = require("path");
var link = require(path.resolve(__dirname, "./link.js"));

// Gets and prints data about ticket and link to ServiceNow instance 
function getTicketData (taskNumber, response) {
    var taskNumber;
    var searchResult;

    api.getRecordById(taskNumber, function(err, result) {
        if (err) {
            response.send("Task not found, please try again");
            console.error(err);
        }
        else {
            var sysClass = result['dv_sys_class_name'];
            console.log(sysClass);
            // Checks what tasks class is and sets state by it
            var state;
            switch (result['dv_sys_class_name']) {
                case 'Incident':
                    state = result['dv_incident_state'];
                    console.log(state);
                    break;
                case 'Ticket':
                    state = result['dv_state'];
                    console.log(state);
                    break;
                case 'Problem':
                    state = result['dv_problem_state'];
                    console.log(state);
                    break;
                case 'Change Request':
                    state = result['dv_state'];
                    console.log(state);
                    break;
                case 'Change Task':
                    state = result['dv_state'];
                    console.log(state);
                    break;
                case 'Requested Item':
                    state = result['dv_state'];
                    console.log(state);
                    break;
                case 'Project Task':
                    state = result['dv_state'];
                    console.log(state);
                    break;
            }
            searchResult = {
                'number': result.number,
                'short_description': result.short_description,
                'description': result.description,
                'dv_assigned_to': result.dv_assigned_to,
                'dv_assignment_group': result.dv_assignment_group,
                'dv_sys_updated_on': result.dv_sys_updated_on
            };
            
            

            var sysID = result.assigned_to;
            console.log("users sys_id= " + sysID);
            console.log(searchResult);

            console.log(JSON.stringify(searchResult));
                response.send("Task number: " + searchResult['number'] + "\n" + "Short description: " + 
                            searchResult['short_description'] + "\n" + "Description: " + searchResult['description'] + "\n" + "Assigned to: " + searchResult['dv_assigned_to'] +  "\n" + "Assignment group: " + searchResult['dv_assignment_group'] + "\n" 
                             + "State: " + state + "\n" + "Last updated on: " + searchResult['dv_sys_updated_on'] + "\n" + "Link: " + link.urlDirect(taskNumber));  
            
            
        }
    });

    return searchResult;
}

module.exports = {
    getTicketData: getTicketData
}
