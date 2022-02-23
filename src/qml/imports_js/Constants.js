const SlotState = {
    INVALID : -1,
    UNKNOWN : 0,
    FREE : 1,
    OCCUPY : 2,
    SPECIAL : 3,
    PRIVATE : 4
}

Object.freeze(SlotState);

const SlotType = {
        INVALID : -1,
        UNKNOWN : 0,
        PERPENDICULAR : 1,
        PARALLEL : 2,
        OBLIQUE_30 : 3,
        OBLIQUE_45 : 4,
        OBLIQUE_60 : 5
}

Object.freeze(SlotType);

const IsNew = {
        INVALID : -1,
        UNKNOWN : 0,
        OLD : 1,
        NEW : 2,
        LOST : 3
}

Object.freeze(IsNew);


const cmPerPixelX = 1.1;
const cmPerPixelZ = 1;
const carLength = 3000; // mm
const carWidth = 1800; // mm
const cmPerMeter = 100;
const mmPerCm = 10;
const millseccondsPerSecond = 1000;
const slotSceneMovingTo = 20000000;
const movingSpeedFactor = 6;
const slotIdStart = 1;
const roationThreshold = 0.001;
const carHeight = 50; // pixel
const pi = 3.1415926;
const yawSpeedFactor = 1;
//const movingThreshold = 0.01;//m/s
