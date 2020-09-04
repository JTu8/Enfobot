"use strict";

module.exports = function(robot) {
    robot.commands.push(
        "Enfobot give UiPath commands - lists UiPath commands"
    );

    robot.respond(/give UiPath commands/i, function(response) {
        response.send("Enfobot authenticate to UiPath - Authenticates to UiPath Orchestrator" + "\n" + "Enfobot get all robots - Prints info about all robots" + "\n" + 
        "Enfobot get available robots - Prints list of available robots" + "\n" + "Enfobot get all processes - Prints all processes" + "\n" 
        + "Enfobot get job <job name> status - Prints status of a selected job" 
        + "\n" + "Enfobot start job <job name> with robot <robot name> - Starts specified job with specified robot" +
        "\n" + "Enfobot fill this Excel for me <Excel filename without extension> - Fills selected offer Excel");
    });
};
