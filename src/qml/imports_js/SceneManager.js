.import "Utils.js" as Utils
.import "Constants.js" as Constants


var lastSlotId =  -1;
var instances = [];
var initZ = 0;

function addSlot(parent, combinedData, carOffset) {
    var pixelCoordinate = Utils.convertCoordinate(combinedData, carOffset);
    var positionX = pixelCoordinate.pointStartX > 0 ?
                pixelCoordinate.pointStartX + pixelCoordinate.depth / 2 :
                pixelCoordinate.pointStartX - (pixelCoordinate.depth / 2);
    var offset = 0;
    var roation = Qt.vector3d(0, 0, 0);
    if (combinedData.type === Constants.SlotType.PERPENDICULAR) {
        offset = pixelCoordinate.width / 2 - Constants.carWidth / 2 / Constants.mmPerCm / Constants.cmPerPixelZ;
        roation = Qt.vector3d(0, 90, 0);
    } else if (combinedData.type === Constants.SlotType.PARALLEL) {
        offset = pixelCoordinate.width / 2 - Constants.carLength / 2 / Constants.mmPerCm / Constants.cmPerPixelZ;
    } else {
        console.log("Slot type is not supported...");
        return;
    }

    var positionZ = pixelCoordinate.pointStartZ - offset;
    console.log("APA:Add slot, positionX:" + positionX + ",positionY:" + pixelCoordinate.pointStartY, "positonZ:" + positionZ);
}

function addCar(parent, combinedData, carOffset) {
    addSlot(parent, combinedData, carOffset);
    var pixelCoordinate = Utils.convertCoordinate(combinedData, carOffset);

    var positionX = pixelCoordinate.pointStartX > 0 ?
                pixelCoordinate.pointStartX + pixelCoordinate.depth / 2 :
                pixelCoordinate.pointStartX - (pixelCoordinate.depth / 2);
    var offset = 0;
    var roation = Qt.vector3d(0, 0, 0);
    if (combinedData.type === Constants.SlotType.PERPENDICULAR) {
        offset = pixelCoordinate.width / 2 - Constants.carWidth / 2 / 10 / Constants.cmPerPixelZ;
        roation = Qt.vector3d(0, 90, 0);
    } else if (combinedData.type === Constants.SlotType.PARALLEL) {
        offset = pixelCoordinate.width / 2 - Constants.carLength / 2 / 10 / Constants.cmPerPixelZ;
    } else {
        console.log("Slot type is not supported...");
    }

    var positionZ = pixelCoordinate.pointStartZ - offset;
    console.log("positionX:" + positionX + ",positionY:" + pixelCoordinate.pointStartY, "positonZ:" + positionZ);
    var carComponent = Qt.createComponent("qrc:/qml/asset_imports/Car_NPC/Car_NPC.qml");
    var localVec = parent.mapPositionFromScene(Qt.vector3d(positionX, pixelCoordinate.pointStartY, positionZ))
    let carObject = carComponent.createObject(parent,
        {
            "position": localVec,
            "id": "car1",
            "opacity": 1,
            "scale": Qt.vector3d(1, 1, 1),
            "eulerRotation": roation
        });



    //instances.push(carObject);

//    var anim = Qt.createQmlObject ('import QtQuick 2.15; NumberAnimation  { }', slotScene);
//    anim.target = carObject;
//    anim.property = "z";
//    anim.to = 2000;
//    anim.duration = 10000;
//    anim.restart();

//    var roatateAnim = Qt.createQmlObject ('import QtQuick 2.15; NumberAnimation  { }', slotScene);
//    roatateAnim.target = parent;
//    roatateAnim.property = "eulerRotation.y";
//    roatateAnim.to = -90;
//    roatateAnim.duration = 15000;
//    roatateAnim.restart();

    console.log("Add a car to scene...");
}

function moveScene(vehicleSpeed, goStraightAnim) {
    goStraightAnim.duration = Qt.binding(function() {
        var pixelSpeed = vehicleSpeed * Constants.cmPerMeter / Constants.cmPerPixelZ;
        pixelSpeed *= Constants.movingSpeedFactor;
        console.log("APA:Pixel moving speed is ", pixelSpeed);

        var duration = (goStraightAnim.to - initZ) / pixelSpeed * Constants.millseccondsPerSecond;
        console.log("APA:slotScene.z is ", slotScene.z, "movingAnim.to is ", goStraightAnim.to, "Moving duration is ", duration);
        return duration;
    });

    goStraightAnim.restart();
}

function clearObjects(slotScene){

}

function rotateScene(carAngle, yawSpeed, turingAnim) {
    turingAnim.restart();
}

function stopRotation(roationAnim) {
    roationAnim.stop();
}

function pauseGoStraightAnim(goStraightAnim) {
    goStraightAnim.pause();
}
