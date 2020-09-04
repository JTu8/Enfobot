"use strict";

module.exports = function(robot) {
    robot.commands.push(
        "Enfobot save tenant <Tenants name> - Saves tenant to robots memory"
    );

    robot.commands.push(
        "Enfobot saved tenants - Shows saved tenant from memory"
    );

    robot.commands.push(
        "Enfobot forget tenant - Removes tenant from memory"
    );

    //Save tenant to robots memory
    robot.respond(/save tenant (.*)/i, function(response) {
        var tenant = response.match[1];

        robot.brain.set('tenant', tenant);
        response.send("Tenant " + tenant + " has been saved to memory");
    });

    robot.respond(/saved tenant/i, function(response) {
        var savedTenant = robot.brain.get('tenant') || {};

        if (robot.brain.get('tenant') == null) {
            response.send("No tenants in memory");
        }
        else {
            response.send("Saved tenant is " + savedTenant);
        }
    });

    robot.respond(/remove tenant/i, function(response) {
        robot.brain.remove('tenant');
        response.send("Tenant removed from memory");
    });
};
