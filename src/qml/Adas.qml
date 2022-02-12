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
    width: 1080
    height: 720

    property bool viewTopBot: true

    property int transitionDuration: 700
    property int roadTransitionDuration: 300

    Rectangle {
        id: rectangleMaskAdas
        rotation: 0
        width: view3D.width
        height: view3D.height
        anchors.centerIn: view3D
        visible: false
        gradient: Gradient {
            GradientStop {
                id: gradientStop1
                position: 0
                color: "#d400a5"
            }

            GradientStop {
                id: gradientStop3
                position: 0.21014
                color: "#d400a5"
            }

            GradientStop {
                id: gradientStop2
                position: 0.81884
                color: "#d400a5"
            }

            GradientStop {
                id: gradientStop
                position: 1
                color: "#d400a5"
            }
        }
    }

    View3D {
        id: view3D
        y: 312
        width: 856
        height: 408

        anchors.horizontalCenter: parent.horizontalCenter
        layer.enabled: true
        environment: sceneEnvironment

        Connections {
            target: uiupdater
            function onCombinedDataUpdated(combinedData) {
                //console.log("combinedData:" + combinedData);
                console.log("combinedData.timestamp:" + combinedData.timestamp + ",slotid:" + combinedData.slotId);
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

        Node {
            id: scene1
            x: 0
            y: 0
            opacity: 1
            z: 0

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

            SpotLight {
                id: lightArea
                x: -75.623
                y: 38.107
                color: "#cc0000"
                brightness: 0
                eulerRotation.z: 0
                eulerRotation.y: -90
                eulerRotation.x: 0
                z: 2.08423
            }
        }

        Node {
            id: sceneCar0
            position: Qt.vector3d(315, 50, 105)

            Car_NPC {
                id: car_NPC0
                opacity: 1
                scale.z: 0.6
                scale.y: 1
                scale.x: 0.5
                eulerRotation.y: 90
            }
        }

        Node {
            position: Qt.vector3d(265, 0, 80)

            eulerRotation.z: 0
            eulerRotation.y: 0
            eulerRotation.x: -90

            Rectangle {
                width: 200
                height: 100
                color: "#8b323e80"
                radius: 10
                border.width: 3
                border.color: "#2666CF"

                Text {
                    id: text0
                    width: 64
                    height: 33
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.horizontalCenter: parent.horizontalCenter
                    color: "#233cc9"
                    text: qsTr("P")
                    font.pixelSize: 30
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter

                    font.bold: true
                }
            }
        }

        Node {
            id: sceneCar1
            position: Qt.vector3d(315, 50, -25)

            Car_NPC {
                id: car_NPC1
                opacity: 1
                scale.z: 0.6
                scale.y: 1
                scale.x: 0.5
                eulerRotation.y: 90
            }
        }

        Node {
            position: Qt.vector3d(265, 0, -70)

            eulerRotation.z: 0
            eulerRotation.y: 0
            eulerRotation.x: -90

            Rectangle {
                width: 200
                height: 150
                color: "#8b323e80"
                radius: 10
                border.width: 3
                border.color: "#2666CF"

                Text {
                    id: text1
                    width: 64
                    height: 33
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.horizontalCenter: parent.horizontalCenter
                    color: "#233cc9"
                    text: qsTr("P")
                    font.pixelSize: 30
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter

                    font.bold: true
                }
            }
        }

        Node {
            id: sceneCar2
            position: Qt.vector3d(315, 50, -225)

            Car_NPC {
                id: car_NPC2
                opacity: 1
                scale.z: 0.6
                scale.y: 1
                scale.x: 0.5
                eulerRotation.y: 90
            }
        }
        Node {
            position: Qt.vector3d(265, 0, -270)

            eulerRotation.z: 0
            eulerRotation.y: 0
            eulerRotation.x: -90

            Rectangle {
                width: 200
                height: 150
                color: "#8b323e80"
                radius: 10
                border.width: 3
                border.color: "#2666CF"

                Text {
                    id: text2
                    width: 64
                    height: 33
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.horizontalCenter: parent.horizontalCenter
                    color: "#233cc9"
                    text: qsTr("P")
                    font.pixelSize: 30
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                    font.bold: true
                }
            }
        }

        Node {
            id: sceneCar3
            position: Qt.vector3d(315, 50, -425)

            Car_NPC {
                id: car_NPC3
                opacity: 1
                scale.z: 0.6
                scale.y: 1
                scale.x: 0.5
                eulerRotation.y: 90
            }
        }
        Node {
            position: Qt.vector3d(265, 0, -470)

            eulerRotation.z: 0
            eulerRotation.y: 0
            eulerRotation.x: -90

            Rectangle {
                width: 200
                height: 150
                color: "#8b323e80"
                radius: 10
                border.width: 3
                border.color: "#2666CF"

                Text {
                    id: text3
                    width: 64
                    height: 33
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.horizontalCenter: parent.horizontalCenter
                    color: "#233cc9"
                    text: qsTr("P")
                    font.pixelSize: 30
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                    font.bold: true
                }
            }
        }

        Node {
            id: sceneCar4
            position: Qt.vector3d(315, 50, -625)

            Car_NPC {
                id: car_NPC4
                opacity: 1
                scale.z: 0.6
                scale.y: 1
                scale.x: 0.5
                eulerRotation.y: 90
            }
        }
        Node {
            position: Qt.vector3d(265, 0, -670)

            eulerRotation.z: 0
            eulerRotation.y: 0
            eulerRotation.x: -90

            Rectangle {
                width: 200
                height: 150
                color: "#8b323e80"
                radius: 10
                border.width: 3
                border.color: "#2666CF"

                Text {
                    id: text4
                    width: 64
                    height: 33
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.horizontalCenter: parent.horizontalCenter
                    color: "#233cc9"
                    text: qsTr("P")
                    font.pixelSize: 30
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                    font.bold: true
                }
            }
        }


        Node {
            position: Qt.vector3d(-255, 0, 15)

            eulerRotation.z: 0
            eulerRotation.y: 0
            eulerRotation.x: -90

            Rectangle {
                width: 130
                height: 200
                color: "#8b323e80"
                radius: 10
                border.width: 3
                border.color: "#2666CF"

                Text {
                    id: textL0
                    width: 64
                    height: 33
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.horizontalCenter: parent.horizontalCenter
                    color: "#233cc9"
                    text: qsTr("P")
                    font.pixelSize: 30
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter

                    font.bold: true
                }
            }
        }

        Node {
            position: Qt.vector3d(-255, 0, -285)

            eulerRotation.z: 0
            eulerRotation.y: 0
            eulerRotation.x: -90

            Rectangle {
                width: 130
                height: 200
                color: "#8b323e80"
                radius: 10
                border.width: 3
                border.color: "#2666CF"

                Text {
                    id: textL1
                    width: 64
                    height: 33
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.horizontalCenter: parent.horizontalCenter
                    color: "#233cc9"
                    text: qsTr("P")
                    font.pixelSize: 30
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter

                    font.bold: true
                }
            }
        }

        Node {
            position: Qt.vector3d(-255, 0, -586)

            eulerRotation.z: 0
            eulerRotation.y: 0
            eulerRotation.x: -90

            Rectangle {
                width: 130
                height: 200
                color: "#8b323e80"
                radius: 10
                border.width: 3
                border.color: "#2666CF"

                Text {
                    id: textL2
                    width: 64
                    height: 33
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.horizontalCenter: parent.horizontalCenter
                    color: "#233cc9"
                    text: qsTr("P")
                    font.pixelSize: 30
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter

                    font.bold: true
                }
            }
        }


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

