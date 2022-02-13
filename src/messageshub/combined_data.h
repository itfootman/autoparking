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
private:
    Q_GADGET

    Q_PROPERTY(long long timestamp READ timestamp)
    Q_PROPERTY(float vehicleSpeed READ vehicleSpeed)
    Q_PROPERTY(double yawSpeed READ yawSpeed)
    Q_PROPERTY(float carAngle READ carAngle)
    Q_PROPERTY(int num READ num)
    Q_PROPERTY(int slotId READ slotId)
    Q_PROPERTY(int state READ state)
    Q_PROPERTY(int type READ type)
    Q_PROPERTY(int isNew READ isNew)
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

    bool isReady() const {
        return readyFlag == (VEHICLE_INFO() | SLOT_FUSION_INFO());
    }

    void clearReadyFlag() {
        readyFlag = INITIAL_BASE();
    }

    int64_t timestamp() const {
        return timestamp_;
    }

    float vehicleSpeed() const {
        return vehicleSpeed_;
    }

    float yawSpeed() const {
        return yawSpeed_;
    }

    float carAngle() const {
        return carAngle_;
    }

    int32_t num() const {
        return num_;
    }

    int32_t slotId() const {
        return slotId_;
    }

    int32_t state() const {
        return state_;
    }

    int32_t type() const {
        return type_;
    }

    int32_t isNew() const {
        return isNew_;
    }

    float pointStartX() const {
        return pointStartX_;
    }

    float pointStartY() const {
        return pointStartY_;
    }

    float pointEndX() const {
        return pointEndX_;
    }

    float pointEndY() const {
        return pointEndY_;
    }

    float pointDepthStartX() const {
        return pointDepthStartX_;
    }

    float pointDepthStartY() const {
        return pointDepthStartY_;
    }

    float pointDepthEndX() const {
        return pointDepthEndX_;
    }

    float pointDepthEndY() const {
        return pointDepthEndY_;
    }

    int64_t timestamp_ = -1;
    float vehicleSpeed_ = 0.0f;
    float yawSpeed_ = 0.0f;
    float carAngle_ = 0.0f;
    int32_t num_ = 0;
    int32_t slotId_ = -1;
    int32_t state_ = -1;
    int32_t type_ = -1;
    int32_t isNew_ = -1;
    float pointStartX_ = std::nan("1");
    float pointStartY_ = std::nan("1");
    float pointEndX_ = std::nan("1");
    float pointEndY_ = std::nan("1");
    float pointDepthStartX_ = std::nan("1");
    float pointDepthStartY_ = std::nan("1");
    float pointDepthEndX_ = std::nan("1");
    float pointDepthEndY_ = std::nan("1");
};
//}
Q_DECLARE_METATYPE(CombinedData)
