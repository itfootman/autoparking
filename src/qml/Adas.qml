import QtQuick 2.8
import QtQuick.Timeline 1.0
import QtQuick3D 1.15
import QtQuick 2.15

import Car_NPC 1.0
import QtQuick3D.Materials 1.15
import QtQuick3D.Effects 1.15
import Coupe 1.0

import QtQuick.Controls 2.15
import hmi.autoparking 1.0
import "qrc:/qml/imports_js/Constants.js" as Constants
import "qrc:/qml/imports_js/SceneManager.js" as SceneManager
import "qrc:/qml/imports_js/Logger.js" as Logger

Item {
    id: adas
    width: 500
    height: 650

    property bool viewTopBot: true
    property int transitionDuration: 700
    property int roadTransitionDuration: 300

    View3D {
        id: view3D
        y: 50
        width: 500
        height: 650

        anchors.horizontalCenter: parent.horizontalCenter
        layer.enabled: true
        environment: sceneEnvironment

        Node {
            z: 0
//            ParallelAnimation {
//                id: turningAnim
//                running: false
//                loops: Animation.Infinite

//                NumberAnimation {
//                    id:movingAnim
//                    target: slotScene
//                    property: "z"
//                    to: Constants.slotSceneMovingTo
//                    easing.type: Easing.Linear
//                }

//                NumberAnimation {
//                    id:roationAnim
//                    target: slotScene
//                    property: "eulerRotation.y"
//                    to:360
//                    duration: 20000
//                    easing.type: Easing.Linear
//                }
//            }

            NumberAnimation {
                id:goStraightAnim
                target: slotScene
                running: false
                property: "z"
                to: Constants.slotSceneMovingTo
                easing.type: Easing.Linear
            }

            NumberAnimation {
                id:turningAnim
                running: false
                target: slotScene
                loops: 1
                property: "eulerRotation.y"
                to:90
                duration: 30000
                easing.type: Easing.Linear
            }

            id: slotScene
            Connections {
                target: uiupdater
                function onCombinedDataUpdated(combinedData) {
                     Logger.dumpCombinedData(combinedData);
                    if (combinedData.vehicleSpeed > 0 && !goStraightAnim.running) {
                        SceneManager.moveScene(combinedData.vehicleSpeed, goStraightAnim);
                        if (Math.abs(combinedData.yawSpeed) > 0 && !turningAnim.running ) {
                           SceneManager.rotateScene(combinedData.carAngle, combinedData.yawSpeed, turningAnim)
                        } else {
                           SceneManager.stopRotation(turningAnim);
                        }
                    } else if (combinedData.vehicleSpeed <= 0)  {
                        SceneManager.pauseGoStraight(goStraightAnim);
                    }

                    if (combinedData.num > 0 && combinedData.slotId !== -1 &&
                        combinedData.slotId !== SceneManager.lastSlotId &&
                        combinedData.isNew === Constants.IsNew.NEW) {
                        SceneManager.lastSlotId = combinedData.slotId;
                        if (combinedData.slotId === Constants.slotIdStart) {
                            SceneManager.clearObjects();
                        }

                        if (combinedData.state === Constants.SlotState.OCCUPY) {
                            SceneManager.addCar(slotScene, combinedData, Math.abs(coupe.z));
                        } else if (combinedData.state === Constants.SlotState.FREE) {
                            SceneManager.addSlot(slotScene, combinedData, Math.abs(coupe.z));
                        } else {
                            console.log("Do not process temporarily.");
                        }
                    }
                }
            }

            Component.onCompleted: {
                SceneManager.initZ = slotScene.z;
            }
        }

        HDRBloomTonemap {
            id: hDRBloomTonemap
            blurFalloff: 2
            channelThreshold: 0.6
            bloomThreshold: 0.4
            gamma: 1
        }

        SceneEnvironment {
            id: sceneEnvironment
            probeBrightness: 120
            depthPrePassEnabled: false
            effects: [hDRBloomTonemap]
            antialiasingMode: SceneEnvironment.SSAA
            antialiasingQuality: SceneEnvironment.VeryHigh
            backgroundMode: SceneEnvironment.Transparent
            lightProbe: Texture {
                source: "assets/hdr/Studio_05e.hdr"
            }
        }

        Coupe {
            id: coupe
            x: 0
            y: 0
            z: -1000

            metalness: 0.5
            specularTint: 0

            carPaintColor: "#a1a8b3"
            carPaintRoughness: 0.2

            opacity: 1
            interiorLightsVisible: true
            specular: 0

            windowOpacity: 0.0
            windowColor: "#ffffff"
            windowRoughness: 0
            windowMetalness: 0
            carBodyOpacity: 1
            scale.z: 1
            scale.y: 1
            scale.x: 1
            eulerRotation.z: 0
            eulerRotation.y: 180
            eulerRotation.x: 0

            SpotLight {
                id: interiorSpotLight

                x: -61.394
                z: -10.38797

                y: 83.29

                eulerRotation.z: -94.27788
                eulerRotation.y: 93.69339
                eulerRotation.x: -59.65046
            }
            SpotLight {
                id: interiorSpotLight1
                x: 59.714
                y: 86.446
                z: -13.2774
                eulerRotation.z: 89.99998
                eulerRotation.x: -59.52864
                eulerRotation.y: -89.99999
            }
            SpotLight {
                id: interiorSpotLight2
                eulerRotation.z: -179.99998
                eulerRotation.y: 179.99998
                x: -2.698
                y: 67.368
                eulerRotation.x: -50
                z: 29.74187
            }
        }

        PerspectiveCamera {
            id: camera
            y: 414.59
            z: 450.86456
            clipFar: 5000
            fieldOfView: 42
            eulerRotation.x: -24

            SpotLight {
                id: additionalLight
                x: -259.213
                y: -44.611
                eulerRotation.z: 4.06186
                eulerRotation.y: -42.61913
                eulerRotation.x: -10.04321
                color: "#fde8b4"
                scale.z: 1
                scale.y: 3.99541
                scale.x: 1
                brightness: 35
                z: -326.18591
            }

//            Component.onCompleted: {
//                camera.lookAt(Qt.vector3d(0, 100, -1500));
//            }
        }
    } // View3D


    Button {
        id: button
        anchors.horizontalCenter: parent.horizontalCenter
        text: "开始泊车"
        onClicked: {
            if (!turningAnim.running) {
                turningAnim.restart();
            } else {
                turningAnim.stop();
            }
        }
    }



}

/*##^##
Designer {
    D{i:0;height:714;width:1388}D{i:26}D{i:213;property:"brightness";target:"lightArea"}
D{i:29}
}
##^##*/

