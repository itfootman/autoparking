import QtQuick 2.15
import QtQuick3D 1.15
import QtQuick.Studio.Effects 1.0

import QtQuick3D.Materials 1.15
import QtQuick3D.Effects 1.15


Node {
    id: rootNode
    visible: true
    Model {
        id: road
        y: -254.692
        z: -254.692
        eulerRotation.x: -90
        source: "meshes/road.mesh"
        materials: principledMaterial
        pivot.x: 0

        PrincipledMaterial {
            id: principledMaterial
            opacity: 1
            opacityMap: mainTexture
            opacityChannel: Material.R
            baseColorMap: mainTexture
            baseColor: "#ffffff"
            metalness: 1
            Texture {
                id: mainTexture
                source: "roadBackground_Dark.png"
            }
        }
    }
}




