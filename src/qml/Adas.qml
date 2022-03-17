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
    width: Constants.sceneWidth
    height: Constants.sceneHeight

    property bool viewTopBot: true
    property int transitionDuration: 700
    property int roadTransitionDuration: 300

    View3D {
        id: view3D
        y: 50
        width: Constants.sceneWidth
        height: Constants.sceneHeight

        //anchors.horizontalCenter: parent.horizontalCenter
        anchors.fill: parent
        //layer.enabled: true
        environment: sceneEnvironment

        Node {
            id: wrapperNode
            z: -1500 + Constants.carLength / Constants.mmPerCm / Constants.cmPerPixelZ
            eulerRotation.y: 0
//            Behavior on eulerRotation.y  {
//                id: rotateSceneBehavior
//                SmoothedAnimation {
//                    id: rotateSceneAnim
//                    easing.type: Easing.Linear
//                }
//            }



            Node {
                property alias parallelMovingAnim: parallelAnim
                property alias goStraightAnimZ: movingAnimZ
                property alias goStraightAnimX: movingAnimX
                property alias turningAnim: rotateSceneAnim
                x: 0
                z: 0
                ParallelAnimation {
                    running: false
                    id: parallelAnim
                    NumberAnimation {
                        id: movingAnimZ
                        target: slotScene
                        property: "z"
                        from: 0
                        to: Constants.slotSceneMovingTo
                        easing.type: Easing.Linear
                    }

                    NumberAnimation {
                        id: movingAnimX
                        target: slotScene
                        property: "x"
                        from: 0
                        to: Constants.slotSceneMovingTo
                        easing.type: Easing.Linear
                    }

                    NumberAnimation {
                      id: rotateSceneAnim
                      target: wrapperNode
                      property: "eulerRotation.y"
                      easing.type: Easing.Linear
                    }
                }

                id: slotScene
                Connections {
                    target: uiupdater
                    function onCombinedDataUpdated(combinedData) {
                        SceneManager.initScene(slotScene, combinedData);
                        SceneManager.controlScene(wrapperNode, slotScene, combinedData);
                    }
                } // Connections

                Component.onCompleted: {
                    SceneManager.initZ = slotScene.z;
;
               // slotScene.rotate(-90, Qt.vector3d(0,1,0), Node.LocalSpace);
                    var roation = wrapperNode.eulerRotation.y / 180 * Constants.pi;
//                    var deltay = -(1000 * Math.cos(roation) + 5000 * Math.sin(roation));
//                    var deltax = -(-1000 * Math.sin(roation) - 5000 * Math.cos(roation));
                    var slotComponent = Qt.createComponent("qrc:/qml/asset_imports/Slot/Slot.qml");
//                    var localVec = Qt.vector3d(500 * Math.sin(roation) - 500 * Math.cos(roation) +
//                                               deltay * Math.cos(roation) - deltax * Math.sin(roation)
//                                               , 0,
//                                               -500 * Math.cos(roation) - 500 * Math.sin(roation) +
//                                               deltay * Math.sin(roation)  + deltax * Math.cos(roation));
                    var x0 = 800;
                    var y0 = 500;
                    var newx = -(y0 * Math.cos(roation) - x0 * Math.sin(roation) + slotScene.x);
                    var newz = -(y0 * Math.sin(roation) + x0 * Math.cos(roation) + slotScene.z);
                    var localVec = Qt.vector3d(newx, 0, newz);
                 //   var scenePos = wrapperNode.mapPositionToNode(slotScene, localVec);

//                    let slotObject = slotComponent.createObject(slotScene,
//                        {
//                            "position": localVec,
//                            "id": "tempSlotId",
//                            "eulerRotation": Qt.vector3d(-90, 0, 0)
//                        });

//                    slotObject.changeText("Test");
//                    slotObject.changeSize(400, 200);
//                    slotObject.changeBackgroundColor("#10FF0000");

//                    console.log("scenePos:",localVec, "roation:", roation);
//                    console.log("wrapperScene:", wrapperNode.x, ",", wrapperNode.z);
//                    console.log("slotScene:", slotScene.x, ",", slotScene.z);
//                    console.log("#####################add a slot##################");
                }
            }
        } // node wrapper

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
            z: -1500

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
