import QtQuick 2.15
import QtQuick.Window 2.15
import QtQuick.Controls 2.15
//import Themes 1.0

import hmi.autoparking 1.0

//Window {
//    width: 1080
//    height: 720
//    visible: true
//    title: qsTr("autoparking")
    Item {
        id: autoparking
        width: 500
        height: 650

       signal signalAddObject()
        Adas {
            id: adas
//            x: 532
//            anchors.right: parent.right
//            anchors.top: parent.top
//            anchors.bottom: parent.bottom
//            anchors.topMargin: 0
//            anchors.bottomMargin: 0
//            anchors.rightMargin: 02

            anchors.horizontalCenter: parent.horizontalCenter
        }

        Button {
            id: add
            anchors.right: parent.right
           // anchors.margins: 10
            text: "add"
            onClicked: {
                console.log("emit add object signal...")
                signalAddObject();
            }
        }
    }
//}

