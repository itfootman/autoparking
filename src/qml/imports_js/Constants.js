const SlotState = {
    INVALID : -1,
    UNKOWN : 0,
    FREE : 1,
    OCCUPY : 2,
    SPECIAL : 3,
    PRIVATE : 4
}

Object.freeze(SlotState);

const SlotType = {
        INVALID : -1,
        UNKOWN : 0,
        PERPENDICULAR : 1,
        PARALLEL : 2,
        OBLIQUE_30 : 3,
        OBLIQUE_45 : 4,
        OBLIQUE_60 : 5
}

Object.freeze(SlotType);


const cmPerPixelX = 1
const cmPerPixelZ = 1
const carLength = 460
const carWidth = 180
