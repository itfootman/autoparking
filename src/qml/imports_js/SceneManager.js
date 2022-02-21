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
    var roation = Qt.vector3d(0, 0, 0);
    if (combinedData.type === Constants.SlotType.PERPENDICULAR) {
        roation = Qt.vector3d(-90, 0, 0);
    } else if (combinedData.type === Constants.SlotType.PARALLEL) {
         roation = Qt.vector3d(-90, 90, 0);
    } else {
        console.log("Slot type is not supported...");
        return;
    }

    var offsetz = pixelCoordinate.width / 2;
    var positionZ = pixelCoordinate.pointStartZ - offsetz;
    console.log("APA:Add slot, positionX:" + positionX + ",positionY:" + pixelCoordinate.pointStartY, "positonZ:" + positionZ);

    var slotComponent = Qt.createComponent("qrc:/qml/asset_imports/Slot/Slot.qml");
    var localVec = parent.mapPositionFromScene(Qt.vector3d(positionX, pixelCoordinate.pointStartY, positionZ));
    localVec.y = -Constants.carHeight;
    let slotObject = slotComponent.createObject(parent,
        {
            "position": localVec,
            "id": "slot1",
            "eulerRotation": roation
        });

    if (combinedData.state === Constants.SlotState.FREE) {
        slotObject.changeBackgroundColor("#1000FF00");
    } else if (combinedData.state === Constants.SlotState.OCCUPY) {
        slotObject.changeBackgroundColor("#10FF0000");
    }

    if (combinedData.type === Constants.SlotType.PERPENDICULAR) {
        slotObject.changeSize(pixelCoordinate.depth, pixelCoordinate.width);
    } else if (combinedData.type === Constants.SlotType.PARALLEL) {
        slotObject.changeSize(pixelCoordinate.width, pixelCoordinate.depth);
    }

    console.log("APA: Add slot ", slotObject, "to scene successfully.");
}

function addCar(parent, combinedData, carOffset) {
    addSlot(parent, combinedData, carOffset);
    var pixelCoordinate = Utils.convertCoordinate(combinedData, carOffset);

    var positionX = pixelCoordinate.pointStartX > 0 ?
                pixelCoordinate.pointStartX + pixelCoordinate.depth / 2 :
                pixelCoordinate.pointStartX - (pixelCoordinate.depth / 2);
    var offsetz = pixelCoordinate.width / 2;
    var offsetx = 0;
    var roation = Qt.vector3d(0, 0, 0);

    if (combinedData.type === Constants.SlotType.PERPENDICULAR) {
        roation = Qt.vector3d(0, 90, 0);
        positionX += positionX > 0 ? Constants.carLength / 2 / Constants.mmPerCm / Constants.cmPerPixelX:
                                     -Constants.carLength / 2 / Constants.mmPerCm / Constants.cmPerPixelX;
    } else if (combinedData.type === Constants.SlotType.PARALLEL) {
    } else {
        console.log("Slot type is not supported...");
    }

    var positionZ = pixelCoordinate.pointStartZ - offsetz;
    if (combinedData.type === Constants.SlotType.PARALLEL) {
        positionZ += Constants.carLength / 2 / Constants.mmPerCm / Constants.cmPerPixelZ;
    }

    console.log("APA: Add car, positionX:" + positionX + ",positionY:" + pixelCoordinate.pointStartY, "positonZ:" + positionZ);
    var carComponent = Qt.createComponent("qrc:/qml/asset_imports/Car_NPC/Car_NPC.qml");
    var localVec = parent.mapPositionFromScene(Qt.vector3d(positionX, pixelCoordinate.pointStartY, positionZ))
    let carObject = carComponent.createObject(parent,
        {
            "position": localVec,
            "id": "car1",
            "opacity": 1,
            "scale": Qt.vector3d(1.1, 1.1, 1.1),
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
       // console.log("APA:slotScene.z is ", slotScene.z, "movingAnim.to is ", goStraightAnim.to, "Moving duration is ", duration);
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
