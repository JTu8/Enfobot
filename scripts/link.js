"use strict";

const api = require("servicenow-lite");
// Prints link to the ServiceNow instance
function urlDirect(taskNumber) {
    return(api.config.ROOT_URL + "/nav_to.do?uri=" + api.config.tableName(taskNumber) + ".do?sys_id=" + taskNumber);
}

module.exports = {
    urlDirect: urlDirect
}
