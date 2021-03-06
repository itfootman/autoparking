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
var initWorldX = 0;
var initWorldY = 0;
var initSlotSceneX = 0;
var initSlotSceneZ = 0;
var translation = 0;
var firstCarAngle = 0;
var recordYawAngle = 0;

function isInScene(slotId) {
    return instances.has(slotId);
}

function calculateYaw(combinedData) {
    var deltaAngle = 0;
    if (combinedData.carAngle * lastCarAngle < 0) {
        recordYawAngle = yawAngle;
        initCarAngle = combinedData.carAngle;
        deltaAngle = recordYawAngle;
        lastCarAngle = initCarAngle;
    } else {
       deltaAngle = combinedData.carAngle - initCarAngle;
       deltaAngle += recordYawAngle;
    }

    lastCarAngle = combinedData.carAngle;

    if (Math.abs(deltaAngle) <= Constants.yawDeviation) {
        deltaAngle = 0;
    } else {
        if (deltaAngle > 0) {
            deltaAngle -= Constants.yawDeviation;
        } else {
            deltaAngle += Constants.yawDeviation;
        }
    }

    return deltaAngle;
}

function initScene(slotScene, combinedData) {
    // Todo change the condition to judge points' size
    if (combinedData.slotPoints.length > 0 && combinedData.slotPoints[0] !== 0 && !sceneInited) {
        initCarAngle = combinedData.carAngle;
        lastCarAngle = combinedData.carAngle;
        firstCarAngle = combinedData.carAngle;
        initWorldX = combinedData.worldX;
        initWorldY = combinedData.worldY;
        initSlotSceneX = slotScene.x;
        initSlotSceneZ = slotScene.z;
        console.log("APA: Init scene complete.");
        sceneInited = true;
        yawAngle = calculateYaw(combinedData);
        slotScene.turningAnim.from = yawAngle;
        slotScene.turningAnim.to = yawAngle;
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

function calculateOffset(slotScene, worldX, worldY) {
    return {
        "deltaX" : (worldX - initWorldX) * Math.sin(firstCarAngle),
        "deltaY" : (worldX - initWorldX) * Math.cos(firstCarAngle) + (worldY - initWorldY) * Math.sin(firstCarAngle),
        "slotSceneDeltaX": slotScene.x - initSlotSceneX,
        "slotSceneDeltaZ": slotScene.z - initSlotSceneZ
    }
}

function controlScene(wrapperNode, slotScene, combinedData) {
//    if (combinedData.slotIds.length > 0) {
//        if(combinedData.slotPoints.length > 0) {
//            Logger.dumpCombinedData(combinedData);
//        }
//    }

    if (sceneInited) {
        yawAngle = calculateYaw(combinedData);
        translation = calculateOffset(slotScene, combinedData.worldX, combinedData.worldY);
        console.log("################################", combinedData.timestamp, "###########################################")

        console.log("GlobalValues: {\n",
                    "    timestamp:", combinedData.timestamp, "\n",
                    "    firstCarAngle:", firstCarAngle, "\n",
                    "    initCarAngle:", initCarAngle, "\n",
                    "    carAngle:", combinedData.carAngle, "\n",
                    "    yawAngle:",  yawAngle, "\n",
                    "    recordYawAngle:", recordYawAngle, "\n",
                    "    yawSpeed:",     combinedData.yawSpeed, "\n",
                    "    vehicleSpeed:", combinedData.vehicleSpeed, "\n",
                    "    initWordXY:(",initWorldX,",",initWorldY,")\n",
                    "    worldXY:(",combinedData.worldX,",",combinedData.worldY,")\n",
                    "    translation:(",translation.deltaX,",",translation.deltaY,",",translation.slotSceneDeltaX,",",translation.slotSceneDeltaZ,")\n",
                    "\n}");

        if (Math.abs(combinedData.vehicleSpeed) > 0) {
            animateScene(wrapperNode, slotScene, combinedData.vehicleSpeed, combinedData.yawSpeed);
        } else {
            pauseGoStraight(slotScene.goStraightAnimZ, slotScene.goStraightAnimX);
            stopRotation(wrapperNode, slotScene.turningAnim);
        }

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
}

function addSlot(parent, slotId, pointsArray, type, state, carOffset, isShowText) {
    var pixelCoordinate = Utils.convertCoordinate(pointsArray, carOffset, translation, -yawAngle);
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
    var localVec = Qt.vector3d(positionX, pixelCoordinate.pointStartY - Constants.carHeight, positionZ);
//    if (Math.abs(localVec.x) > Math.abs(localVec.z)) {
//        var temp = localVec.x;
//        localVec.x = localVec.z;
//        localVec.z = temp;
//    }

//    if (slotId === 38) {
//        console.log("#############biwenyang: change position z..");
//        localVec.z = -6500;
//        localVec.x = -1000;
//    }
//QVector3D(-5463.74, -50, -2744.29)
    //var localVec = parent.mapPositionFromScene(Qt.vector3d(positionX, pixelCoordinate.pointStartY - Constants.carHeight, positionZ));
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
 //   if (slotId === 38) {
//         slotObject.changeSize(480, 201);
//    }


    instances.set(slotId, slotObject);
    console.log("SlotInfo:{\n",
                "    slotId:", slotId, "\n",
                "    type:", type,     "\n",
                "    state:", state,   "\n",
                "    VehiclePoints:(",pointsArray[0],",",pointsArray[1],",\n",
                "                   ",pointsArray[2],",",pointsArray[3], ",\n",
                "                   ",pointsArray[4],",",pointsArray[5], ",\n",
                "                   ",pointsArray[6],",",pointsArray[7], ")\n",
                "    pixelPosition:", localVec,
                "\n}");
}

function addCar(parent, slotId, pointsArray, type, state, carOffset) {
    addSlot(parent, slotId, pointsArray, type, state, carOffset, false);

    var pixelCoordinate = Utils.convertCoordinate(pointsArray, carOffset, translation, -yawAngle);

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

    var carComponent = Qt.createComponent("qrc:/qml/asset_imports/Car_NPC/Car_NPC.qml");
    var localVec = parent.mapPositionFromScene(Qt.vector3d(positionX, pixelCoordinate.pointStartY, positionZ));
    var carId = "car" + carCount;
    let carObject = carComponent.createObject(parent,
        {
            "position": localVec,
            "id": carId,
            "opacity": 1,
            "scale": Qt.vector3d(1, 1, 1),
            "eulerRotation": roation
        });

    console.log("APA: Add car, local position:", localVec);
    console.log("APA: Add car, positionX:" + positionX + ",positionY:" + pixelCoordinate.pointStartY, "positonZ:" + positionZ);
    console.log("APA: Add a car ", carObject, " to scene successfully...");
}

function animateScene(wrapperNode, slotScene, vehicleSpeed, yawSpeed) {
    moveScene(slotScene, vehicleSpeed);
    rotateScene(wrapperNode, yawSpeed, slotScene.turningAnim);
    slotScene.parallelMovingAnim.restart();
}

function moveScene(slotScene, vehicleSpeed) {
    var pixelSpeed = vehicleSpeed * Constants.cmPerMeter / Constants.cmPerPixelZ;
    pixelSpeed *= Constants.movingSpeedFactor;

    var pixelSpeedZ = pixelSpeed * Math.cos(yawAngle);
    var pixelSpeedX = pixelSpeed * Math.sin(yawAngle);

    if (Math.abs(pixelSpeedZ) >= Constants.movingThreshold) {
        if (pixelSpeedZ < 0) {
            slotScene.goStraightAnimZ.to = -Constants.slotSceneMovingTo;
        } else {
            slotScene.goStraightAnimZ.to = Constants.slotSceneMovingTo;
        }
        slotScene.goStraightAnimZ.duration = Math.abs((slotScene.goStraightAnimZ.to - slotScene.z)) / Math.abs(pixelSpeedZ) * Constants.millseccondsPerSecond;
        slotScene.goStraightAnimZ.from = slotScene.z;

    } else {
       slotScene.goStraightAnimZ.from = slotScene.z;
       slotScene.goStraightAnimZ.to = slotScene.z;
       slotScene.goStraightAnimZ.duration = Number.MAX_SAFE_INTEGER;
    }

    if (Math.abs(pixelSpeedX) >= Constants.movingThreshold) {
        slotScene.goStraightAnimX.from = slotScene.x;
        if (pixelSpeedX < 0) {
            slotScene.goStraightAnimX.to = -Constants.slotSceneMovingTo;
        } else {
            slotScene.goStraightAnimX.to = Constants.slotSceneMovingTo;
        }

        slotScene.goStraightAnimX.duration = Math.abs((slotScene.goStraightAnimX.to - slotScene.x)) / Math.abs(pixelSpeedX) * Constants.millseccondsPerSecond;

    } else {
        slotScene.goStraightAnimX.from = slotScene.x;
        slotScene.goStraightAnimX.to = slotScene.x;
        slotScene.goStraightAnimX.duration = Number.MAX_SAFE_INTEGER;
    }

    console.log("Moving info: {\n",
                "    vehicleSpeed:", vehicleSpeed, "\n",
                "    pixelSpeed:",   pixelSpeed,   "\n",
                "    moveToZ:",      slotScene.goStraightAnimZ.to, "\n",
                "    slotSceneZ:",   slotScene.z,  "\n",
                "    pixelSpeedZ:",  pixelSpeedZ,  "\n",
                "    moveDurationZ:", slotScene.goStraightAnimZ.duration, "\n",
                "    moveToX:",      slotScene.goStraightAnimX.to, "\n",
                "    slotSceneX:",   slotScene.x,  "\n",
                "    pixelSpeedX:",  pixelSpeedX,  "\n",
                "    moveDurationX:", slotScene.goStraightAnimX.duration, "\n}");
}

function clearObjects(slotScene){
    console.log("APA: Clear all slots in cache...");
    instances.clear();
}

function rotateScene(wrapperNode, yawSpeed, rotateSceneAnim) {
    var degreeSpeed = Utils.convertToDegree(Math.abs(yawSpeed));
    var curDegree = Utils.convertToDegree(yawAngle);
    rotateSceneAnim.from = rotateSceneAnim.to;
    rotateSceneAnim.to = -curDegree;
    rotateSceneAnim.duration = Math.abs((rotateSceneAnim.to - rotateSceneAnim.from)) / degreeSpeed * Constants.millseccondsPerSecond;

    console.log("Rotation info:{\n",
                "    yawspeed:", yawSpeed, "\n",
                "    degreeSpeed:", degreeSpeed, "\n",
                "    yawAngle:", yawAngle, "\n",
                "    wrapperNode.eulerRotation.y:", wrapperNode.eulerRotation.y,
                "\n}");
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

//    rotateSceneAnim.duration = 0.01;
//    wrapperNode.eulerRotation.y = 0;
//    recordYawAngle = 0;
//    yawAngle = 0;
}

function resetScene(slotScene) {
    console.log("APA:============Reset Scene...");
    slotScene.z = 0;
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
