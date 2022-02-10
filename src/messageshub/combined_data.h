_Pragma("once")
#include <cmath>
#include <QMetaType>
#include <qqml.h>

//namespace hmi {
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
    Q_PROPERTY(int64_t timestamp READ timestamp)
    Q_PROPERTY(float vehicleSpeed READ vehicleSpeed)
    Q_PROPERTY(double yawSpeed READ yawSpeed)
    Q_PROPERTY(int32_t num READ num)
    Q_PROPERTY(int32_t slotId READ slotId)
    Q_PROPERTY(float pointStartX READ pointStartX)
    Q_PROPERTY(float pointStartY READ pointStartY)
    Q_PROPERTY(float pointEndX READ pointEndX)
    Q_PROPERTY(float pointEndY READ pointEndY)
    Q_PROPERTY(float pointDepthStartX READ pointDepthStartX)
    Q_PROPERTY(float pointDepthStartY READ pointDepthStartY)
    Q_PROPERTY(float pointDepthEndX READ pointDepthEndX)
    Q_PROPERTY(float pointDepthEndY READ pointDepthEndY)

public:
    uint16_t readyFlag = INITIAL_BASE();

    bool isReady() {
        return readyFlag == (VEHICLE_INFO() | SLOT_FUSION_INFO());
    }

    void clearReadyFlag() {
        readyFlag = INITIAL_BASE();
    }

    int64_t timestamp = -1;
    float vehicleSpeed = 0.0f;
    float yawSpeed = 0.0f;
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
};
//}
Q_DECLARE_METATYPE(CombinedData)
