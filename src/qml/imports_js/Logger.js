.import "Constants.js" as Constants
function dumpCombinedData(combinedData) {
    console.log("combinedData: {",
                        "\n  timestamp: ", combinedData.timestamp,
                        "\n  vehicleSpeed: ", combinedData.vehicleSpeed,
                        "\n  yawspeed: ", combinedData.yawSpeed,
                        "\n  carAngle: ", combinedData.carAngle,
                        "\n  num: ",combinedData.num,
                      "\n}");

    for (var i = 0; i < combinedData.slotPoints.length; i += Constants.slotPointsCount) {
        console.log("slotPoints:(", combinedData.slotPoints[i], ",", combinedData.slotPoints[i + 1], ",",
                                    combinedData.slotPoints[i + 2],  ",", combinedData.slotPoints[i + 3], ",",
                                    combinedData.slotPoints[i + 4],  ",", combinedData.slotPoints[i + 5], ",",
                                    combinedData.slotPoints[i + 6],  ",", combinedData.slotPoints[i + 7], ",",
                    ")\n");
    }
}
