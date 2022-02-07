#include "messages_hub.h"
#include <QMetaObject>

namespace hmi {
MessagesHub::MessagesHub() {
}

MessagesHub::~MessagesHub() {
}

void MessagesHub::plugIn() {
    workThread_ = std::make_unique<std::thread>(&MessagesHub::workLoop, this);
}

void MessagesHub::addObserver(const std::shared_ptr<Observer>& observer) {
    std::lock_guard<std::mutex> l(observerMutex_);
    observers_.push_back(observer);
}

void MessagesHub::removeObserver(const std::shared_ptr<Observer>& observer) {
    std::lock_guard<std::mutex> l(observerMutex_);
    std::remove(observers_.begin(), observers_.end(), observer);
}

void MessagesHub::workLoop() {
    ros::NodeHandle n;
    ros::Subscriber fusion_info_sub = n.subscribe("fusion_info", 1000, &MessagesHub::onSlotFusionMessage, this);
    ros::Subscriber vehicle_info_sub = n.subscribe("vehicle_info", 1000, &MessagesHub::onVehicleMessage, this);
    ros::spin();
}

void MessagesHub::onVehicleMessage(const autoparking::vehicle_infoConstPtr& msg) {
    double linearSpeedX = msg->linearSpeed.x;
    double linearSpeedY = msg->linearSpeed.y;
    float vehicleSpeed = msg->vehicleSpeed;
    double yawSpeed = msg->accelStamped.accel.angular.z;
    ROS_INFO("Vehicle info-timestamp:%ld, vehicleSpeed:%lf, linearSpeedY:%lf, yawSpeed:%lf",
             msg->timestamp, vehicleSpeed, linearSpeedY, yawSpeed);

    combinedData_.yawSpeed = msg->accelStamped.accel.angular.z;
    combinedData_.vehicleSpeed = msg->vehicleSpeed;
    combinedData_.timestamp = msg->timestamp;
    combinedData_.readyFlag |= VEHICLE_INFO();
    if (combinedData_.isReady()) {
        onOneFrameReady(combinedData_);
        combinedData_.clearReadyFlag();
    }
}

void MessagesHub::onSlotFusionMessage(const autoparking::fusion_infoConstPtr& msg) {
    geometry_msgs::Point32 point_start;
    point_start.x = -1.0f;
    point_start.y = -1.0f;
    point_start.z = -1.0f;

    geometry_msgs::Point32 point_end;
    point_end.x = -1.0f;
    point_end.y = -1.0f;
    point_end.z = -1.0f;

    geometry_msgs::Point32 point_depth_start;
    point_depth_start.x = -1.0f;
    point_depth_start.y = -1.0f;
    point_depth_start.z = -1.0f;

    geometry_msgs::Point32 point_depth_end;
    point_depth_end.x = -1.0f;
    point_depth_end.y = -1.0f;
    point_depth_end.z = -1.0f;

    if (msg->polygonStamped.size() > 0) {
        if (msg->polygonStamped[0].polygon.points.size() >= 4) {
            point_start.x = msg->polygonStamped[0].polygon.points[0].x;
            point_start.y = msg->polygonStamped[0].polygon.points[0].y;
            point_end.x = msg->polygonStamped[0].polygon.points[1].x;
            point_end.y = msg->polygonStamped[0].polygon.points[1].y;
            point_depth_start.x = msg->polygonStamped[0].polygon.points[2].x;
            point_depth_start.y = msg->polygonStamped[0].polygon.points[2].y;
            point_depth_end.x = msg->polygonStamped[0].polygon.points[3].x;
            point_depth_end.y = msg->polygonStamped[0].polygon.points[3].y;
        }
    }

    ROS_INFO("Fusion-timestamp:%ld, num:%d, type:%d, state:%d,is_new:%d,"
             "slot_id:%d, count:%ld, target_id:%d, delay_time:%ld,"
             "points[(%lf, %lf), (%lf, %lf), (%lf, %lf)]",
             msg->timestamp, msg->num, msg->type.size() > 0 ? msg->type[0] : -1,
             msg->state.size() > 0 ? msg->state[0] : -1,
             msg->is_new.size() > 0 ? msg->is_new[0] : -1,
             msg->slot_id.size() > 0 ? msg->slot_id[0] : -1,
             msg->count, msg->target_id, msg->delay_time,
             point_start.x, point_start.y, point_end.x, point_end.y,
             point_depth_start.x, point_depth_start.y, point_depth_end.x, point_depth_end.y);

    int32_t slotId = msg->slot_id.size() > 0 ? msg->slot_id[0] : -1;
    if (slotId == -1 || msg->num <= 0 || lastSlotId == slotId) {
        return;
    }

    lastSlotId = slotId;
    combinedData_.num = msg->num;
    combinedData_.slotId = slotId;
    combinedData_.pointStartX = point_start.x;
    combinedData_.pointStartY = point_start.y;
    combinedData_.pointEndX = point_end.x;
    combinedData_.pointEndY = point_end.y;
    combinedData_.pointDepthStartX = point_depth_start.x;
    combinedData_.pointDepthStartY = point_depth_start.y;
    combinedData_.pointDepthEndX = point_depth_end.x;
    combinedData_.pointDepthEndY = point_depth_end.y;
    combinedData_.readyFlag |= SLOT_FUSION_INFO();

    static bool hasReported = false;
    float epsilon = 0.01f;

    if (combinedData_.isReady() && combinedData_.vehicleSpeed <= epsilon  && !hasReported) {
        combinedData_.vehicleSpeed = 0.0f;
        combinedData_.yawSpeed = 0.0f;
        combinedData_.readyFlag |= VEHICLE_INFO();
        onOneFrameReady(combinedData_);
        combinedData_.clearReadyFlag();
        hasReported = true;
        return;
    }

    if (combinedData_.isReady()) {
        onOneFrameReady(combinedData_);
        combinedData_.clearReadyFlag();
    }
}

void MessagesHub::onOneFrameReady(const CombinedData& combinedData) {
    for (const auto& o : observers_) {
        QMetaObject::invokeMethod(o.get() , "onUpdate" , Qt::AutoConnection
            , Q_ARG(CombinedData, combinedData));
    }
}
}
