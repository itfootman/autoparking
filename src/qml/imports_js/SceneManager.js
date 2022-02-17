.import "Utils.js" as Utils
.import "Constants.js" as Constants

var lastSlotId =  -1;
var instances = [];
var parentMoved = 0;
function addCar(parent, combinedData, carOffset) {
    var pixelCoordinate = Utils.convertCoordinate(combinedData, carOffset);

    var positionX = pixelCoordinate.pointStartX > 0 ?
                pixelCoordinate.pointStartX + pixelCoordinate.depth / 2 :
                pixelCoordinate.pointStartX - (pixelCoordinate.depth / 2);
    var offset = 0;
    var roation = Qt.vector3d(0, 0, 0);
    if (combinedData.type === Constants.SlotType.PERPENDICULAR) {
        offset = pixelCoordinate.width / 2;
        roation = Qt.vector3d(0, 90, 0);
    } else if (combinedData.type === Constants.SlotType.PARALLEL) {
        offset = pixelCoordinate.depth / 2;
    } else {
        console.log("Slot type is not supported...");
    }

    var positionZ = pixelCoordinate.pointStartZ - offset;
    console.log("positionX:" + positionX + ",positionY:" + pixelCoordinate.pointStartY, "positonZ:" + positionZ);
    var carComponent = Qt.createComponent("qrc:/qml/asset_imports/Quick3DAssets/Car_NPC/Car_NPC.qml");
    let carObject = carComponent.createObject(parent,
        {
            "position": Qt.vector3d(positionX, pixelCoordinate.pointStartY, positionZ),
            "id": "car1",
            "opacity": 1,
            "scale": Qt.vector3d(1, 1, 1),
            "eulerRotation": roation
        });

    //instances.push(carObject);

    var anim = Qt.createQmlObject ('import QtQuick 2.15; NumberAnimation  { }', slotScene);
    anim.target = carObject;
    anim.property = "z";
    anim.to = 2000;
    anim.duration = 10000;
    anim.restart();

//    var roatateAnim = Qt.createQmlObject ('import QtQuick 2.15; NumberAnimation  { }', slotScene);
//    roatateAnim.target = parent;
//    roatateAnim.property = "eulerRotation.y";
//    roatateAnim.to = -90;
//    roatateAnim.duration = 15000;
//    roatateAnim.restart();

    console.log("Add a car to scene...");
}
