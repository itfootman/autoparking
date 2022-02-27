.import "Utils.js" as Utils
.import "Constants.js" as Constants
.import "Logger.js" as Logger

var lastSlotId =  -1;
var instances = new Map();
var initZ = 0;
var carCount = 0;
var slotCount = 0;

function isInScene(slotId) {
    return instances.has(slotId);
}

function controlScene(slotScene, combinedData, goStraightAnim, turningAnim) {
    Logger.dumpCombinedData(combinedData);
    // Init initial rotation degree of car.
    slotScene.eulerRotation.y = -combinedData.carAngle;

    if (Math.abs(combinedData.vehicleSpeed) > 0) {
        moveScene(slotScene, combinedData.vehicleSpeed, goStraightAnim);

        if (Math.abs(combinedData.yawSpeed) > 0) {
            rotateScene(slotScene, combinedData.carAngle, combinedData.yawSpeed, turningAnim);
        } else {
            stopRotation(turningAnim);
        }
    } else if (Math.abs(combinedData.vehicleSpeed) <= 0)  {
        pauseGoStraight(goStraightAnim);
        pauseRotation(turningAnim);
    }

    if (combinedData.slotId === Constants.slotIdStart) {
        clearObjects();
    }

    if (combinedData.num > 0 && combinedData.slotId !== -1 &&
        !isInScene(combinedData.slotId) &&
        (combinedData.isNew !== Constants.IsNew.INVALID)) {
        lastSlotId = combinedData.slotId;

        if (combinedData.state === Constants.SlotState.OCCUPY) {
            addCar(slotScene, combinedData, Math.abs(coupe.z));
        } else if (combinedData.state === Constants.SlotState.FREE || combinedData.state === Constants.SlotState.UNKNOWN) {
            addSlot(slotScene, combinedData, Math.abs(coupe.z), true);
        } else {
            console.log("APA: Do not process temporarily.");
        }
    }
}

function addSlot(parent, combinedData, carOffset, isShowText) {
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
        console.log("APA: Slot type is not supported...");
        return;
    }

    slotCount++;
    var offsetz = pixelCoordinate.width / 2;
    var positionZ = pixelCoordinate.pointStartZ - offsetz;
    console.log("APA: Add slot, positionX:" + positionX + ",positionY:" + pixelCoordinate.pointStartY, "positonZ:" + positionZ);

    var slotComponent = Qt.createComponent("qrc:/qml/asset_imports/Slot/Slot.qml");
    var localVec = parent.mapPositionFromScene(Qt.vector3d(positionX, pixelCoordinate.pointStartY, positionZ));
    console.log("APA: Add slot, local position:" + localVec);
    localVec.y = -Constants.carHeight;
    var slotId = "slot" + slotCount;
    let slotObject = slotComponent.createObject(parent,
        {
            "position": localVec,
            "id": slotId,
            "eulerRotation": roation
        });

    if (combinedData.state === Constants.SlotState.FREE) {
        slotObject.changeBackgroundColor("#1000FF00");
    } else if (combinedData.state === Constants.SlotState.OCCUPY) {
        slotObject.changeBackgroundColor("#10FF0000");
    }

    slotObject.showText(isShowText);

    if (combinedData.type === Constants.SlotType.PERPENDICULAR) {
        slotObject.changeSize(pixelCoordinate.depth, pixelCoordinate.width);
    } else if (combinedData.type === Constants.SlotType.PARALLEL) {
        slotObject.changeSize(pixelCoordinate.width, pixelCoordinate.depth);
    }

    instances.set(combinedData.slotId, slotObject);

    console.log("APA: Add slot ", slotObject, " to scene successfully, instances size:", instances.size);
}

function addCar(parent, combinedData, carOffset) {
    addSlot(parent, combinedData, carOffset, false);

    var pixelCoordinate = Utils.convertCoordinate(combinedData, carOffset);

    var positionX = pixelCoordinate.pointStartX > 0 ?
                pixelCoordinate.pointStartX + pixelCoordinate.depth / 2 :
                pixelCoordinate.pointStartX - (pixelCoordinate.depth / 2);
    var offsetz = pixelCoordinate.width / 2;
    var offsetx = 0;
    var roation = Qt.vector3d(0, 0, 0);

    if (combinedData.type === Constants.SlotType.PERPENDICULAR) {
        roation = Qt.vector3d(0, 90, 0);
        positionX += positionX > 0 ? Constants.carLength / 4 / Constants.mmPerCm / Constants.cmPerPixelX:
                                     -Constants.carLength / 4 / Constants.mmPerCm / Constants.cmPerPixelX;
    } else if (combinedData.type === Constants.SlotType.PARALLEL) {
    } else {
        console.log("APA: Slot type is not supported...");
        return;
    }

    carCount++;
    var positionZ = pixelCoordinate.pointStartZ - offsetz;
    if (combinedData.type === Constants.SlotType.PARALLEL) {
        positionZ += Constants.carLength / 2 / Constants.mmPerCm / Constants.cmPerPixelZ;
    }

    console.log("APA: Add car, positionX:" + positionX + ",positionY:" + pixelCoordinate.pointStartY, "positonZ:" + positionZ);
    var carComponent = Qt.createComponent("qrc:/qml/asset_imports/Car_NPC/Car_NPC.qml");
    var localVec = parent.mapPositionFromScene(Qt.vector3d(positionX, pixelCoordinate.pointStartY, positionZ));
    console.log("APA: Add car, local position:", localVec);
    var carId = "car" + carCount;
    let carObject = carComponent.createObject(parent,
        {
            "position": localVec,
            "id": carId,
            "opacity": 1,
            "scale": Qt.vector3d(1, 1, 1),
            "eulerRotation": roation
        });

    console.log("APA: Add a car ", carObject, " to scene successfully...");
}

function moveScene(slotScene, vehicleSpeed, goStraightAnim) {
    var pixelSpeed = vehicleSpeed * Constants.cmPerMeter / Constants.cmPerPixelZ;
    pixelSpeed *= Constants.movingSpeedFactor;
    console.log("APA:Pixel moving speed is ", pixelSpeed);

    goStraightAnim.duration = (goStraightAnim.to - initZ) / pixelSpeed * Constants.millseccondsPerSecond;
   // console.log("APA:slotScene.z is ", slotScene.z, "movingAnim.to is ", goStraightAnim.to, "Moving duration is ", duration);
    goStraightAnim.from = slotScene.z;
    //goStraightAnim.restart();
}

function clearObjects(slotScene){
    console.log("APA: Clear all slots in cache...");
  //  instances.clear();
}

function rotateScene(slotScene, carAngle, yawSpeed, turningAnim) {

//    var degreeSpeed = yawSpeed * 180 / Constants.pi * Constants.yawSpeedFactor;

//    turningAnim.duration = Math.abs(turningAnim.to - slotScene.eulerRotation.y) / degreeSpeed * Constants.millseccondsPerSecond * 1000;
//    console.log("APA: turning duration is", turningAnim.duration);

   // var localPivot = slotScene.mapPositionFromScene(Qt.vector3d(0, 0, -800));

    slotScene.pivot = Qt.vector3d(0, 0, -1000);
   // slotScene.changePivotShow(localPivot);

    //turingAnim.duration = 200000;
//    slotScene.eulerRotation.y = carAngle;
//    if (!turningAnim.running) {
//        turningAnim.restart();
//    }

    slotScene.eulerRotation.y = carAngle * 180 / Constants.pi;
   // slotScene.rotate(carAngle * 180 / Constants.pi, Qt.vector3d(0, 0, -1000), slotScene.SceneSpace)

    console.log("APA: Begin to turn...");
}

function pauseRotation(rotationAnim) {
    if (rotationAnim.running) {
        console.log("APA: Pause turning...");
        rotationAnim.pause();
    }
}

function stopRotation(rotationAnim) {
    if (rotationAnim.running) {
        console.log("APA: Stop turning...");
        rotationAnim.stop();
    }
}

function pauseGoStraight(goStraightAnim) {
    if (goStraightAnim.running) {
        goStraightAnim.pause();
    }
}
