import QtQuick 2.15
import QtQuick.Window 2.15
import QtQuick.Controls 2.15
import "qrc:/qml/imports_js/Constants.js" as Constants
//import Themes 1.0

import hmi.autoparking 1.0

Item {
    id: autoparking
    width: Constants.sceneWidth
    height: Constants.sceneHeight
    signal signalAddObject()

    Adas {
        id: adas
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


