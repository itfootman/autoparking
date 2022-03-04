.import "Constants.js" as Constants
// Here need complicate linear algera calculation. Please see readme.
function convertCoordinate(pointsArray, carOffset, yawAngle) {
    var pointStartX = pointsArray[0];
    var pointStartY = pointsArray[1];
    var pointEndX = pointsArray[2];
    var pointEndY = pointsArray[3];
    var pointDepthStartX = pointsArray[4];
    var pointDepthStartY = pointsArray[5];
    var wxx = (pointEndX - pointStartX) * (pointEndX - pointStartX);
    var wyy = (pointEndY - pointStartY) * (pointEndY - pointStartY);
    var width = Math.sqrt(wxx + wyy);
    var dxx = (pointDepthStartX - pointStartX) * (pointDepthStartX - pointStartX);
    var dyy = (pointDepthStartY - pointStartY) * (pointDepthStartY - pointStartY);
    var depth = Math.sqrt(dxx + dyy);

    width = width / Constants.mmPerCm / Constants.cmPerPixelZ;
    depth = depth / Constants.mmPerCm / Constants.cmPerPixelX;

    // convert to 3D coordinate in mm unit.
    var worldPointStartX = -pointStartX * Math.sin(yawAngle) - pointStartY * Math.cos(yawAngle);
    var pixelPointStartX = worldPointStartX / Constants.mmPerCm / Constants.cmPerPixelX; // pixel in 3D coordinate
    var pixelPointStartY = 0; // z is zero in vehicle coordinate.

    // convert to 3D coordinate in mm unit.
    var worldPointStartZ = -pointStartX * Math.cos(yawAngle) +
            pointStartY * Math.sin(yawAngle) - carOffset * Constants.cmPerPixelZ * Constants.mmPerCm;
    var pixelPointStartZ = worldPointStartZ / Constants.mmPerCm / Constants.cmPerPixelZ;

    return {
        width: width,
        depth: depth,
        pointStartX: pixelPointStartX,
        pointStartY: pixelPointStartY,
        pointStartZ: pixelPointStartZ
    }
}
