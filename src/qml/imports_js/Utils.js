const cmPerPixelX = 1
const cmPerPixelZ = 1
const carLength = 460
const carWidth = 180

function convertCoordinate(combinedData, carOffset) {
    var width = Math.abs(combinedData.pointEndX - combinedData.pointStartX) / 10 / cmPerPixelZ;
    var depth = Math.abs(combinedData.pointDepthStartY - combinedData.pointStartY) / 10 / cmPerPixelX;
    var pointStartX = -combinedData.pointStartY / 10 / cmPerPixelX;
    var pointStartY = 0;
    var pointStartZ = -(combinedData.pointStartX / 10 / cmPerPixelZ + carOffset);

    return {
        width: width,
        depth: depth,
        pointStartX: pointStartX,
        pointStartY: pointStartY,
        pointStartZ: pointStartZ
    }
}
