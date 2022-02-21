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

    function changeSize(width, height) {
        slotFrame.width = width;
        slotFrame.height = height;
    }

    Rectangle {
      // layer.enabled: true
        id: slotFrame
        radius: 10
        z: 100
     //   layer.enabled: true
        border.width: 3
        border.color: "#00000000"
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
