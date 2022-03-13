const SlotState = {
    INVALID : -1,
    UNKNOWN: 0,
    FREE : 1,
    OCCUPY : 5,
    SONAR : 2,
    SPECIAL : 3,
    PRIVATE : 4
}

Object.freeze(SlotState);

const SlotType = {
        INVALID : -1,
        UNKNOWN : 0,
        PERPENDICULAR : 2,
        PARALLEL : 1,
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


const cmPerPixelX = 1.2;
const cmPerPixelZ = 1.2;
const carLength = 3000; // mm
const carWidth = 1800; // mm
const cmPerMeter = 100;
const mmPerCm = 10;
const offsetX = 0;
const millseccondsPerSecond = 1000;
const slotSceneMovingTo = 200000000;
const movingSpeedFactor = 1;
const slotIdStart = 1;
const roationThreshold = 0.03; // rad/s
const movingThresholdX = 0.02;
const movingThreshold = 0.0001;
const yawDeviation = 0.002; //rad
const carHeight = 50; // pixel
const pi = 3.1415926;
const yawSpeedFactor = 0.8;
const sceneWidth = 1000;
const sceneHeight = 800;
const slotPointsCount = 8;
//const movingThreshold = 0.01;//m/s
