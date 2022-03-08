.import "Utils.js" as Utils
.import "Constants.js" as Constants
.import "Logger.js" as Logger

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
    if (combinedData.slotPoints.length > 0 && combinedData.slotPoints[0] !== 0 && !sceneInited) {
        initCarAngle = combinedData.carAngle;
        lastCarAngle = combinedData.carAngle;
        console.log("APA: init angle is ", initCarAngle, "###################");
        sceneInited = true;
    }
}

function isDataValid(combinedData) {
//    console.log("combinedData.num:", combinedData.num, "combinedData.slotIds.length:", combinedData.slotIds.length,
//                "combinedData.types.length:", combinedData.types.length, "combinedData.states.length:", combinedData.states.length,
//                "combinedData.slotPoints.length:", combinedData.slotPoints.length);
    return (combinedData.num > 0 && combinedData.slotIds.length > 0 && combinedData.slotPoints.length > 0 &&
           combinedData.slotPoints.length / Constants.slotPointsCount === combinedData.slotIds.length &&
           combinedData.slotPoints.length / Constants.slotPointsCount === combinedData.states.length &&
           combinedData.slotPoints.length / Constants.slotPointsCount === combinedData.types.length &&
           combinedData.types.length === combinedData.states.length &&
           combinedData.types.length === combinedData.slotIds.length &&
           combinedData.slotPoints.length >= Constants.slotPointsCount);
}

function controlScene(wrapperNode, slotScene, combinedData, goStraightAnimZ, goStraightAnimX, rotateAnim) {
//    if (combinedData.slotIds.length > 0) {
//        if(combinedData.slotPoints.length > 0) {
//            Logger.dumpCombinedData(combinedData);
//        }
//    }
    if (sceneInited) {
        yawAngle = calculateYaw(combinedData);
        console.log("APA:yawAngle is ", yawAngle, "###########");
    }

    // Init initial rotation degree of car.

   // slotScene.eulerRotation.y = -combinedData.carAngle;

    if (Math.abs(combinedData.vehicleSpeed) > 0) {
        moveScene(slotScene, combinedData.vehicleSpeed, goStraightAnimZ, goStraightAnimX);
        console.log("APA: yawspeed is ", combinedData.yawSpeed);
        if (Math.abs(combinedData.yawSpeed) > Constants.roationThreshold) {
            rotateScene(wrapperNode, yawAngle, combinedData.yawSpeed, rotateAnim);
        } else {
            stopRotation(wrapperNode, rotateAnim);
        }
    } else if (Math.abs(combinedData.vehicleSpeed) <= 0)  {
        pauseGoStraight(goStraightAnimZ, goStraightAnimX);
        stopRotation(wrapperNode, rotateAnim);
    }

    console.log("APA: timestamp:", combinedData.timestamp, "worldX:", combinedData.worldX, ",worldY:", combinedData.worldY, ",carAngle:", combinedData.carAngle);
    if (isDataValid(combinedData)) {
        var j = 0;
        for (var i = 0; i < combinedData.slotIds.length; i++) {
            if (!isInScene(combinedData.slotIds[i]) && combinedData.isNews[i] !== Constants.IsNew.INVALID) {
                var pointsArray = [];
                for (var k = 0; k < Constants.slotPointsCount; k++) {
                    if (combinedData.slotPoints[j + k] !== 0) {
                        pointsArray[k] = combinedData.slotPoints[j + k];
                    }
                }
                if (pointsArray.length > 0) {
                    var carOffsetPixel = Math.abs(coupe.z) - Constants.carLength / 2 / Constants.mmPerCm / Constants.cmPerPixelZ;
                    if (combinedData.states[i] === Constants.SlotState.OCCUPY) {
                        addCar(slotScene, combinedData.slotIds[i], pointsArray, combinedData.types[i], combinedData.states[i], carOffsetPixel);
                    } else if (combinedData.states[i] === Constants.SlotState.FREE || combinedData.states[i] === Constants.SlotState.SONAR || combinedData.states[i] === Constants.SlotState.UNKNOWN) {
                        addSlot(slotScene, combinedData.slotIds[i], pointsArray, combinedData.types[i], combinedData.states[i], carOffsetPixel, true);
                    } else {
                        console.log("APA: State is", combinedData.states[i], "Do not process temporarily.");
                    }
                }
            }

            j += Constants.slotPointsCount;
        }
     }
}

function addSlot(parent, slotId, pointsArray, type, state, carOffset, isShowText) {

    console.log("APA: add Slot--Vehicle coordinate,", "slotId:", slotId, "type:", type, "state:", state,
                   "slotPoints:(", pointsArray[0], ",", pointsArray[1], ",",
                    pointsArray[2],  ",", pointsArray[3], ",",
                    pointsArray[4],  ",", pointsArray[5], ",",
                    pointsArray[6],  ",", pointsArray[7], ",", ")");

    var pixelCoordinate = Utils.convertCoordinate(pointsArray, carOffset, yawAngle);
    var positionX = pixelCoordinate.pointStartX > 0 ?
                pixelCoordinate.pointStartX + pixelCoordinate.depth / 2  - Constants.offsetX:
                pixelCoordinate.pointStartX - (pixelCoordinate.depth / 2) + Constants.offsetX;
    var roation = Qt.vector3d(0, 0, 0);
    if (type === Constants.SlotType.PERPENDICULAR) {
        roation = Qt.vector3d(-90, yawAngle * 180 / Constants.pi, 0);
    } else if (type === Constants.SlotType.PARALLEL) {
         roation = Qt.vector3d(-90, 90 + yawAngle * 180 / Constants.pi, 0);
    } else {
        console.log("APA: Slot type ", type, " is not supported...");
        return;
    }

    slotCount++;
    var offsetz = pixelCoordinate.width / 2;
    var positionZ = pixelCoordinate.pointStartZ - offsetz;

    var slotComponent = Qt.createComponent("qrc:/qml/asset_imports/Slot/Slot.qml");
    var localVec = parent.mapPositionFromScene(Qt.vector3d(positionX, pixelCoordinate.pointStartY - Constants.carHeight, positionZ));
    var tempSlotId = "slot" + slotCount;
    let slotObject = slotComponent.createObject(parent,
        {
            "position": localVec,
            "id": tempSlotId,
            "eulerRotation": roation
        });

    slotObject.changeText(slotId);

    if (state === Constants.SlotState.FREE || state === Constants.SlotState.UNKNOWN || state === Constants.SlotState.SONAR) {
        slotObject.changeBackgroundColor("#1000FF00");
    } else if (state === Constants.SlotState.OCCUPY) {
        slotObject.changeBackgroundColor("#10FF0000");
    }

    slotObject.showText(isShowText);

    if (type === Constants.SlotType.PERPENDICULAR) {
        slotObject.changeSize(pixelCoordinate.depth, pixelCoordinate.width);
    } else if (type === Constants.SlotType.PARALLEL) {
        slotObject.changeSize(pixelCoordinate.width, pixelCoordinate.depth);
    }

    instances.set(slotId, slotObject);
    console.log("APA: Add slot--", "slotId:", slotId, ",positionX:" + positionX + ",positionY:" + pixelCoordinate.pointStartY, "positonZ:" + positionZ, "local position:" + localVec);
}

function addCar(parent, slotId, pointsArray, type, state, carOffset) {
    addSlot(parent, slotId, pointsArray, type, state, carOffset, false);

    var pixelCoordinate = Utils.convertCoordinate(pointsArray, carOffset, yawAngle);

    var positionX = pixelCoordinate.pointStartX > 0 ?
                pixelCoordinate.pointStartX + pixelCoordinate.depth / 2 :
                pixelCoordinate.pointStartX - (pixelCoordinate.depth / 2);
    var offsetz = pixelCoordinate.width / 2;
    var offsetx = 0;
    var roation = Qt.vector3d(0, -yawAngle, 0);

    if (type === Constants.SlotType.PERPENDICULAR) {
        roation = Qt.vector3d(0, 90 - yawAngle, 0);
        positionX += positionX > 0 ? Constants.carLength / 4 / Constants.mmPerCm / Constants.cmPerPixelX:
                                     -Constants.carLength / 4 / Constants.mmPerCm / Constants.cmPerPixelX;
    } else if (type === Constants.SlotType.PARALLEL) {
    } else {
        console.log("APA: Slot type ", type, " is not supported...");
        return;
    }

    carCount++;
    var positionZ = pixelCoordinate.pointStartZ - offsetz;
    if (type === Constants.SlotType.PARALLEL) {
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

function moveScene(slotScene, vehicleSpeed, goStraightAnimZ, goStraightAnimX) {
    var pixelSpeed = vehicleSpeed * Constants.cmPerMeter / Constants.cmPerPixelZ;
    pixelSpeed *= Constants.movingSpeedFactor;
    var pixelSpeedZ = pixelSpeed * Math.cos(yawAngle);
    var pixelSpeedX = pixelSpeed * Math.sin(yawAngle);
    console.log("APA:Vehicle speed is ", vehicleSpeed ,",Pixel moving speed is ", pixelSpeed, "Pixel Z moving speed is ", pixelSpeedZ, "Pixel X moving speed is ", pixelSpeedX);

    if (Math.abs(pixelSpeedZ) >= Constants.movingThreshold) {
        goStraightAnimZ.duration = (goStraightAnimZ.to - slotScene.z) / Math.abs(pixelSpeedZ) * Constants.millseccondsPerSecond;
        goStraightAnimZ.from = slotScene.z;
        goStraightAnimZ.restart();
    } else {
        if (goStraightAnimZ.running) {
            goStraightAnimZ.pause();
        }
    }

    if (Math.abs(pixelSpeedX) >= Constants.movingThreshold) {
        goStraightAnimX.duration = (goStraightAnimX.to - slotScene.x) / Math.abs(pixelSpeedX) * Constants.millseccondsPerSecond;
        goStraightAnimX.from = slotScene.x;
        goStraightAnimX.restart();
    } else {
        if (goStraightAnimX.running) {
            goStraightAnimX.pause();
        }
    }

    //goStraightAnim.duration = 3000000000000
    console.log("APA:slotScene.z is ", slotScene.z, "movingAnim.to is ", goStraightAnimZ.to, "Moving duration is ",  goStraightAnimZ.duration);
    console.log("APA:slotScene.x is ", slotScene.x, "movingAnim.to is ", goStraightAnimX.to, "Moving duration is ",  goStraightAnimX.duration);
}

function clearObjects(slotScene){
    console.log("APA: Clear all slots in cache...");
    instances.clear();
}

function rotateScene(wrapperNode, yawAngle, yawSpeed, rotateSceneAnim) {
   // Todo: Calculate speed for animation.
    var degreeSpeed = yawSpeed * 180 / Constants.pi * Constants.yawSpeedFactor;

 //   if (yawSpeed > Constants.roationThreshold) {
        rotateSceneAnim.velocity = degreeSpeed;
        wrapperNode.eulerRotation.y = -yawAngle * 180 / Constants.pi;
   // } else {
   ///     rotateSceneAnim.velocity = 10000;
   //     wrapperNode.eulerRotation.y = 0;
  //  }
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

function pauseGoStraight(goStraightAnimZ, goStraightAnimX) {
    if (goStraightAnimZ.running) {
        console.log("APA: stop moving ahead z...");
        goStraightAnimZ.pause();
    }

    if (goStraightAnimX.running) {
        console.log("APA: stop moving ahead x...");
        goStraightAnimX.pause();
    }
}
