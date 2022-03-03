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
    Q_PROPERTY(std::vector<int> slotIds READ slotIds)
    Q_PROPERTY(std::vector<int> states READ states)
    Q_PROPERTY(std::vector<int> types READ types)
    Q_PROPERTY(std::vector<int> isNews READ isNews)
    Q_PROPERTY(std::vector<qreal> slotPoints READ slotPoints)

public:
    uint16_t readyFlag = INITIAL_BASE();

    bool isReady() const {
        return readyFlag == (VEHICLE_INFO() | SLOT_FUSION_INFO());
    }

    void clearReadyFlag() {
        readyFlag = INITIAL_BASE();
    }

    void clearData() {
        timestamp_ = -1;
        vehicleSpeed_ = 0.0f;
        yawSpeed_ = 0.0f;
        carAngle_ = 0.0f;
        num_ = 0;
        slotIds_.clear();
        states_.clear();
        types_.clear();
        isNews_.clear();
        slotPoints_.clear();
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

    std::vector<int> slotIds() const {
        return slotIds_;
    }

    std::vector<int> states() const {
        return states_;
    }

    std::vector<int> types() const {
        return types_;
    }

    std::vector<int> isNews() const {
        return isNews_;
    }

    std::vector<qreal> slotPoints() const {
        return slotPoints_;
    }

    int64_t timestamp_ = -1;
    float vehicleSpeed_ = 0.0f;
    float yawSpeed_ = 0.0f;
    float carAngle_ = 0.0f;
    int32_t num_ = 0;
    std::vector<int> slotIds_;
    std::vector<int> states_;
    std::vector<int> types_;
    std::vector<int> isNews_;

    std::vector<qreal> slotPoints_;
};
//}
Q_DECLARE_METATYPE(CombinedData)
