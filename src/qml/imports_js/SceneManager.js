.import "Utils.js" as Utils
.import "Constants.js" as Constants
.import "Logger.js" as Logger

var lastSlotId =  -1;
var instances = new Map();
var initZ = 0;
var carCount = 0;
var slotCount = 0;
var lastCarAngle = 0;
var sceneInited = false;
var initCarAngle = 0;
var yawAngle = 0;

function isInScene(slotId) {
    return instances.has(slotId);
}

function calculateYaw(combinedData) {
    var deltaAngle = 0;
    if (combinedData.carAngle * lastCarAngle < 0) {
        initCarAngle = 0;
        deltaAngle = -(combinedData.carAngle + initCarAngle);
        lastCarAngle = 0;
    } else {
       deltaAngle = combinedData.carAngle - initCarAngle;
    }

    lastCarAngle = combinedData.carAngle;
    return deltaAngle;
}

function initScene(combinedData) {
    // Todo change the condition to judge points' size
    if (combinedData.pointStartX !== -1 && !sceneInited) {
        initCarAngle = combinedData.carAngle;
        lastCarAngle = combinedData.carAngle;
        sceneInited = true;
    }
}

function controlScene(wrapperNode, slotScene, combinedData, goStraightAnim, rotateAnim) {
    if (!isInScene(combinedData.slotId) && combinedData.slotId !== -1) {
        if(combinedData.pointStartX !== -1) {
            Logger.dumpCombinedData(combinedData);
        }
    }

    yawAngle = calculateYaw(combinedData);
    // Init initial rotation degree of car.

   // slotScene.eulerRotation.y = -combinedData.carAngle;

    if (Math.abs(combinedData.vehicleSpeed) > 0) {
        moveScene(slotScene, combinedData.vehicleSpeed, goStraightAnim);

        if (Math.abs(combinedData.yawSpeed) > Constants.roationThreshold) {
            rotateScene(wrapperNode, yawAngle, combinedData.yawSpeed, rotateAnim);
        } else {
            stopRotation(wrapperNode, rotateAnim);
        }
    } else if (Math.abs(combinedData.vehicleSpeed) <= 0)  {
        pauseGoStraight(goStraightAnim);
        stopRotation(wrapperNode, rotateAnim);
    }

    if (combinedData.slotId === Constants.slotIdStart) {
        clearObjects();
    }

    if (combinedData.num > 0 && combinedData.slotId !== -1 &&
        !isInScene(combinedData.slotId) &&
        (combinedData.isNew !== Constants.IsNew.INVALID)) {

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
    var pixelCoordinate = Utils.convertCoordinate(combinedData, carOffset, yawAngle);
    var positionX = pixelCoordinate.pointStartX > 0 ?
                pixelCoordinate.pointStartX + pixelCoordinate.depth / 2  - Constants.offsetX:
                pixelCoordinate.pointStartX - (pixelCoordinate.depth / 2) + Constants.offsetX;
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

    if (combinedData.state === Constants.SlotState.FREE || combinedData.state === Constants.SlotState.UNKNOWN) {
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

    var pixelCoordinate = Utils.convertCoordinate(combinedData, carOffset, deltaAngle);

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
    console.log("APA:slotScene.z is ", slotScene.z, "movingAnim.to is ", goStraightAnim.to, "Moving duration is ",  goStraightAnim.duration);
    goStraightAnim.from = slotScene.z;
    goStraightAnim.restart();
}

function clearObjects(slotScene){
    console.log("APA: Clear all slots in cache...");
    instances.clear();
}

function rotateScene(slotScene, yawAngle, yawSpeed, rotateSceneAnim) {

    var degreeSpeed = yawSpeed * 180 / Constants.pi * Constants.yawSpeedFactor;
   // slotScene.pivot = Qt.vector3d(0, 0, slotScene.z);

   // rotateSceneAnim.duration = Math.abs(rotateSceneAnim.to - slotScene.eulerRotation.y) / degreeSpeed * Constants.millseccondsPerSecond * 1000;
    if (yawSpeed <= 0.01) {
       // rotateSceneAnim.velocity = 10000;
      //  slotScene.eulerRotation.y = 0;
    } else {
        rotateSceneAnim.velocity = 2;
        slotScene.eulerRotation.y = yawAngle * 180 / Constants.pi;
    }

   // console.log("APA: turning duration is", rotateSceneAnim.duration);

   // rotateSceneAnim.restart();



    console.log("APA: Begin to turn...");
}

function pauseRotation(rotateSceneAnim) {
//    if (rotateSceneAnim.running) {
//        console.log("APA: Pause turning...");
//        rotateSceneAnim.pause();
//    }
}

function stopRotation(wrapperNode, rotateSceneAnim) {
//    if (rotateSceneAnim.running) {
//        console.log("APA: Stop turning...");
//        rotateSceneAnim.stop();
//    }

//    rotateSceneAnim.velocity = 10000;
//    wrapperNode.eulerRotation.y = 0;
}

function pauseGoStraight(movingSceneBehavior) {
    if (goStraightAnim.running) {
        goStraightAnim.pause();
    }
}
