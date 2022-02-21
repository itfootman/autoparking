import QtQuick3D 1.15
import QtQuick 2.15
Node {
    eulerRotation.z: 0
    eulerRotation.y: 0
    eulerRotation.x: -90
    opacity: 1
    function changeBackgroundColor(color) {
        slotFrame.color = color;
    }

    Rectangle {
      // layer.enabled: true
        id: slotFrame
        width: 200
        height: 100
        radius: 10
        border.width: 3
        border.color: "#2666CF"
      //  color: "#FF00FF00"

//        Text {
//            id: text0
//            width: 64
//            height: 33
//            anchors.verticalCenter: parent.verticalCenter
//            anchors.horizontalCenter: parent.horizontalCenter
//            color: "#233cc9"
//            text: qsTr("P")
//            font.pixelSize: 30
//            horizontalAlignment: Text.AlignHCenter
//            verticalAlignment: Text.AlignVCenter

//            font.bold: true
//        }
    }

//    Text {
//        text: "Hello world!"
//    }
}
