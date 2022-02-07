_Pragma("once")
#include <cmath>

namespace hmi {
uint16_t constexpr INITIAL_BASE () {
    return 0;
}

uint16_t constexpr VEHICLE_INFO() {
    return 1;
}

uint16_t constexpr SLOT_FUSION_INFO() {
    return 2;
}


struct CombinedData {
    int64_t timestamp = -1;
    float vehicleSpeed = 0.0f;
    double yawSpeed = 0.0f;
    int32_t num = 0;
    int32_t slotId = -1;
    float pointStartX = std::nan("1");
    float pointStartY = std::nan("1");
    float pointEndX = std::nan("1");
    float pointEndY = std::nan("1");
    float pointDepthStartX = std::nan("1");
    float pointDepthStartY = std::nan("1");
    float pointDepthEndX = std::nan("1");
    float pointDepthEndY = std::nan("1");
    uint16_t readyFlag = INITIAL_BASE();

    bool isReady() {
        return readyFlag == (VEHICLE_INFO() | SLOT_FUSION_INFO());
    }

    void clearReadyFlag() {
        readyFlag = INITIAL_BASE();
    }
};
}
