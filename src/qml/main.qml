import QtQuick 2.15
import QtQuick.Window 2.15
import QtQuick.Controls 2.15
//import Themes 1.0

Window {
    width: 1080
    height: 720
    visible: true
    title: qsTr("autoparking")
    Item {
        id: autoparking
        width: 1080
        height: 720
        Item {
            id: background
            anchors.fill: parent
            Image {
                id: background1
                anchors.fill: parent
              //  source: Themes.backgroundImage
            }
        }
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
            id: button
            anchors.horizontalCenter: parent.horizontalCenter
            text: "开始泊车"
        }
    }
}

