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

    function showText(isShowText) {
        if (isShowText) {
            text0.visible = true;
        } else {
            text0.visible = false;
        }
    }

    Rectangle {
      // layer.enabled: true
        id: slotFrame
        radius: 10
     //   layer.enabled: true
        border.width: 3
        border.color: "#00000000"
      //  color: "#FF00FF00"

        Text {
            id: text0
            visible: false
            width: 64
            height: 33
            anchors.verticalCenter: parent.verticalCenter
            anchors.horizontalCenter: parent.horizontalCenter
            color: "#233cc9"
            text: qsTr("P")
            font.pixelSize: 50
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter

            font.bold: false
        }
    }

//    Text {
//        text: "Hello world!"
//    }
}
