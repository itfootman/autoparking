.import "Constants.js" as Constants
function convertCoordinate(combinedData, carOffset) {
    var width = Math.abs(combinedData.pointEndX - combinedData.pointStartX) / 10 / Constants.cmPerPixelZ;
    var depth = Math.abs(combinedData.pointDepthStartY - combinedData.pointStartY) / 10 / Constants.cmPerPixelX;
    var pointStartX = -combinedData.pointStartY / 10 / Constants.cmPerPixelX;
    var pointStartY = 0;
    var pointStartZ = -(combinedData.pointStartX / 10 / Constants.cmPerPixelZ + carOffset);

    return {
        width: width,
        depth: depth,
        pointStartX: pointStartX,
        pointStartY: pointStartY,
        pointStartZ: pointStartZ
    }
}
