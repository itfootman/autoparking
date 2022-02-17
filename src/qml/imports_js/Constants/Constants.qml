import QtQuick 2.0

QtObject {
    enum SlotState {
        UNKOWN = 0,
        FREE = 1,
        OCCUPY = 2,
        SPECIAL = 3,
        PRIVATE = 4
    }

    enum SlotType {
        UNKOWN = 0,
        PERPENDICULAR = 1,
        PARALLEL = 2,
        OBLIQUE_30 = 3,
        OBLIQUE_45 = 4,
        OBLIQUE_60 = 5
    }
}
