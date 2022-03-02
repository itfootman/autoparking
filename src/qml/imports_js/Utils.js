.import "Constants.js" as Constants
// Here need complicate linear algera calculation. Please see readme.
function convertCoordinate(combinedData, carOffset, deltaAngle) {
    var wxx = (combinedData.pointEndX - combinedData.pointStartX) * (combinedData.pointEndX - combinedData.pointStartX);
    var wyy = (combinedData.pointEndY - combinedData.pointStartY) * (combinedData.pointEndY - combinedData.pointStartY);
    var width = Math.sqrt(wxx + wyy);
    var dxx = (combinedData.pointDepthStartX - combinedData.pointStartX) * (combinedData.pointDepthStartX - combinedData.pointStartX);
    var dyy = (combinedData.pointDepthStartY - combinedData.pointStartY) * (combinedData.pointDepthStartY - combinedData.pointStartY);
    var depth = Math.sqrt(dxx + dyy);

    width = width / Constants.mmPerCm / Constants.cmPerPixelZ;
    depth = depth / Constants.mmPerCm / Constants.cmPerPixelX;

    // convert to 3D coordinate in mm unit.
    var pointStartX = -combinedData.pointStartX * Math.sin(deltaAngle) - combinedData.pointStartY * Math.cos(deltaAngle);
    pointStartX = pointStartX / Constants.mmPerCm / Constants.cmPerPixelX; // pixel in 3D coordinate
    var pointStartY = 0; // z is zero in vehicle coordinate.

    // convert to 3D coordinate in mm unit.
    var pointStartZ = -combinedData.pointStartX * Math.cos(deltaAngle) +
            combinedData.pointStartY * Math.sin(deltaAngle) - carOffset * Constants.cmPerPixelZ * Constants.mmPerCm;
    pointStartZ = pointStartZ / Constants.mmPerCm / Constants.cmPerPixelZ;

    return {
        width: width,
        depth: depth,
        pointStartX: pointStartX,
        pointStartY: pointStartY,
        pointStartZ: pointStartZ
    }
}
