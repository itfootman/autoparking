import QtQuick 2.8
import QtQuick.Timeline 1.0
import QtQuick3D 1.15
import QtQuick 2.15
import Quick3DAssets.Road 1.0

//import Quick3DAssets.Car 1.0
import Quick3DAssets.Car_NPC 1.0
import QtQuick3D.Materials 1.15
import QtQuick3D.Effects 1.15
import Quick3DAssets.Coupe 1.0

import QtQuick.Controls 2.15
import hmi.autoparking 1.0

//import Quick3DAssets.CarShadowPlane 1.0
Item {
    id: adas
    width: Constants.width
    height: Constants.height

    property bool viewTopBot: true
    property int transitionDuration: 700
    property int roadTransitionDuration: 300
    property int cmPerPixel:3

    View3D {
        id: view3D
        y: 312
        width: 856
        height: 408

        anchors.horizontalCenter: parent.horizontalCenter
        layer.enabled: true
        environment: sceneEnvironment


//        Component.onCompleted: {
//             var carComponent = Qt.createComponent("qrc:/qml/asset_imports/Quick3DAssets/Car_NPC/Car_NPC.qml");
//            let carObject = carComponent.createObject(view3D,
//                {
//                    //"position": Qt.vector3d(positionX, pixelCoordinate.pointStartY, positionZ),
//                    "position": Qt.vector3d(315, 0, 105),
//                   // "id": "car1",
//                    "opacity": 1,
//                    "scale": Qt.vector3d(0.6, 1, 0.5),
//                    "eulerRotation": Qt.vector3d(0, 90, 0)
//                });
//           // carObject.parent = view3D;
//            console.log("Component.onComplete...");
//            instances.push(carObject);
//        }

        Node{
            property int lastSlotId: -1
            property var instances: []
            id: slotScene
            Connections {
                target: uiupdater
                function onCombinedDataUpdated(combinedData) {
                    slotScene.dumpCombinedData(combinedData);
                   // console.log("combinedData.slotId:", combinedData.slotId, "view3D.lastSlogId:", view3D.lastSlotId);
                    if (combinedData.num > 0 && combinedData.slotId !== -1 && combinedData.slotId !== slotScene.lastSlotId) {
                        slotScene.lastSlotId = combinedData.slotId;
                        if (combinedData.state === 0) {
                           // view3D.addCar(combinedData);
                        }

                       slotScene.addCar(combinedData);
                    }
                }
            }

            function dumpCombinedData(combinedData) {
                console.log(
                    "combinedData: {",
                                    "\n  timestamp: ", combinedData.timestamp,
                                    "\n  vehicleSpeed: ", combinedData.vehicleSpeed,
                                    "\n  yawspeed: ", combinedData.yawSpeed,
                                    "\n  carAngle: ", combinedData.carAngle,
                                    "\n  num: ",combinedData.num,
                                    "\n  slotId: ",combinedData.slotId,
                                    "\n  state: ",combinedData.state,
                                    "\n  isNew: ",combinedData.isNew,
                                    "\n  type: ",combinedData.type,
                                    "\n  pointStartX: ",combinedData.pointStartX,
                                    "\n  pointStartY: ",combinedData.pointStartY,
                                    "\n  pointEndX: ",combinedData.pointEndX,
                                    "\n  pointEndY: ",combinedData.pointEndY,
                                    "\n  pointDepthStartX: ",combinedData.pointDepthStartX,
                                    "\n  pointDepthStartY: ",combinedData.pointDepthStartY,
                                    "\n  pointDepthEndX: ",combinedData.pointDepthEndX,
                                    "\n  pointDepthEndY: ",combinedData.pointDepthEndY,
                                  "\n}");
            }

            function convertCoordinate(combinedData) {
                var width = Math.abs(combinedData.pointEndX - combinedData.pointStartX);
                var depth = Math.abs(combinedData.pointDepthStartY - combinedData.pointStartY);
                var pointStartX = -combinedData.pointStartY / 10 * cmPerPixel;
                var pointStartY = 0;
                var pointStartZ = -(combinedData.pointStartX / 10 * cmPerPixel + Math.abs(coupe.z));

                return {
                    width: width,
                    depth: depth,
                    pointStartX: pointStartX,
                    pointStartY: pointStartY,
                    pointStartZ: pointStartZ
                }
            }

            function addCar(combinedData) {
                var pixelCoordinate = slotScene.convertCoordinate(combinedData);
                var carComponent = Qt.createComponent("qrc:/qml/asset_imports/Quick3DAssets/Car_NPC/Car_NPC.qml");
                var positionX = pixelCoordinate.pointStartX + pixelCoordinate.depth / 2;
                var positionZ = pixelCoordinate.pointStartZ + pixelCoordinate.width / 2;
                console.log("positionX:" + positionX + ",positionY:" + pixelCoordinate.pointStartY, "positonZ:" + positionZ);
                let carObject = carComponent.createObject(slotScene,
                    {
                        "position": Qt.vector3d(positionX, pixelCoordinate.pointStartY, positionZ),
                        //"position": Qt.vector3d(315, 0, 105),
                        "id": "car1",
                        "opacity": 1,
                        "scale": Qt.vector3d(0.6, 1, 0.5),
                        "eulerRotation": Qt.vector3d(0, 90, 0)
                    });
                instances.push(carObject);
                console.log("carObject", carObject);
                console.log("Add a car to scene...");
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

        Node {
            id: scene
            x: -0
            y: 0
            opacity: 1
            z: 0

            Road {
                id: road2
                x: 0
                y: 0
                z: 540.48822
                scale.z: 1
                scale.y: 0
                scale.x: 1.8
                opacity: 1
            }
        }

        Coupe {
            id: coupe
            x: 0
            y: 0
            z: -250

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
            scale.z: 0.6
            scale.y: 0.6
            scale.x: 0.6
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


//        Car_NPC {
//            position: Qt.vector3d(315, 50, 105)
//            id: car_NPC0
//            opacity: 1
//            scale.z: 0.6
//            scale.y: 1
//            scale.x: 0.5
//            eulerRotation.y: 90
//        }


//        Node {
//            position: Qt.vector3d(265, 0, 80)

//            eulerRotation.z: 0
//            eulerRotation.y: 0
//            eulerRotation.x: -90

//            Rectangle {
//                width: 200
//                height: 100
//                color: "#8b323e80"
//                radius: 10
//                border.width: 3
//                border.color: "#2666CF"

//                Text {
//                    id: text0
//                    width: 64
//                    height: 33
//                    anchors.verticalCenter: parent.verticalCenter
//                    anchors.horizontalCenter: parent.horizontalCenter
//                    color: "#233cc9"
//                    text: qsTr("P")
//                    font.pixelSize: 30
//                    horizontalAlignment: Text.AlignHCenter
//                    verticalAlignment: Text.AlignVCenter

//                    font.bold: true
//                }
//            }
//        }

        PerspectiveCamera {
            id: camera
            x: 0
            y: 414.59
            z: 560.86456
            clipFar: 7000
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
        }
    }
}

/*##^##
Designer {
    D{i:0;height:714;width:1388}D{i:26}D{i:213;property:"brightness";target:"lightArea"}
D{i:29}
}
##^##*/

