function dumpCombinedData(combinedData) {
    console.log(
        "combinedData: {",
                        "\n  timestamp: ", combinedData.timestamp,
                        "\n  vehicleSpeed: ", combinedData.vehicleSpeed,
                        "\n  yawspeed: ", combinedData.yawSpeed,
                        "\n  carAngle: ", combinedData.carAngle,
                        "\n  num: ",combinedData.num,
                        "\n  slotId: ",combinedData.slotId,
                        "\n  state: ",combinedData.state,
                        "\n  isNew: ",combinedData.isNew,
                        "\n  type: ",combinedData.type,
                        "\n  pointStartX: ",combinedData.pointStartX,
                        "\n  pointStartY: ",combinedData.pointStartY,
                        "\n  pointEndX: ",combinedData.pointEndX,
                        "\n  pointEndY: ",combinedData.pointEndY,
                        "\n  pointDepthStartX: ",combinedData.pointDepthStartX,
                        "\n  pointDepthStartY: ",combinedData.pointDepthStartY,
                        "\n  pointDepthEndX: ",combinedData.pointDepthEndX,
                        "\n  pointDepthEndY: ",combinedData.pointDepthEndY,
                      "\n}");
}
