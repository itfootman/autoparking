#include "messages_hub.h"
#ifndef WITH_ROS
#include <qthread.h>
#include <qdatetime.h>
#include <fstream>
#endif
#include <QMetaObject>
#include <QtCore>
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

#ifdef WITH_ROS
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
    ROS_DEBUG("Vehicle info-timestamp:%ld, vehicleSpeed:%lf, linearSpeedY:%lf, yawSpeed:%lf",
             msg->timestamp, vehicleSpeed, linearSpeedY, yawSpeed);

    combinedData_.yawSpeed_ = msg->accelStamped.accel.angular.z;
    combinedData_.vehicleSpeed_ = msg->vehicleSpeed;
    combinedData_.timestamp_ = msg->timestamp;
    combinedData_.carAngle_ = msg->APACarPar.z;
    combinedData_.readyFlag |= VEHICLE_INFO();
    if (combinedData_.isReady()) {
        onOneFrameReady(combinedData_);
        combinedData_.clearReadyFlag();
        combinedData_.clearData();
    }
}

void MessagesHub::onSlotFusionMessage(const autoparking::fusion_infoConstPtr& msg) {
    combinedData_.num_ = msg->num;

    if (msg->state.size() == msg->type.size() && msg->state.size() == msg->slot_id.size()) {
        for (size_t j = 0; j < msg->slot_id.size(); ++j) {
            combinedData_.slotIds_.push_back(msg->slot_id[j]);
            combinedData_.states_.push_back(msg->state[j]);
            combinedData_.types_.push_back(msg->type[j]);
        }
    }

    ROS_DEBUG("APA:msg->polygonStamped.size():%u", msg->polygonStamped.size());
    for (size_t i = 0; i < msg->polygonStamped.size(); ++i) {
        ROS_DEBUG("APA:polygon.points.size():%u", msg->polygonStamped[i].polygon.points.size());
        if (msg->polygonStamped[i].polygon.points.size() >= 4) {
            geometry_msgs::Point32 point_start;
            geometry_msgs::Point32 point_end;
            geometry_msgs::Point32 point_depth_start;
            geometry_msgs::Point32 point_depth_end;

            point_start.x = msg->polygonStamped[i].polygon.points[0].x;
            point_start.y = msg->polygonStamped[i].polygon.points[0].y;
            point_end.x = msg->polygonStamped[i].polygon.points[1].x;
            point_end.y = msg->polygonStamped[i].polygon.points[1].y;
            point_depth_start.x = msg->polygonStamped[i].polygon.points[2].x;
            point_depth_start.y = msg->polygonStamped[i].polygon.points[2].y;
            point_depth_end.x = msg->polygonStamped[i].polygon.points[3].x;
            point_depth_end.y = msg->polygonStamped[i].polygon.points[3].y;
            combinedData_.slotPoints_.push_back(point_start.x);
            combinedData_.slotPoints_.push_back(point_start.y);
            combinedData_.slotPoints_.push_back(point_end.x);
            combinedData_.slotPoints_.push_back(point_end.y);
            combinedData_.slotPoints_.push_back(point_depth_start.x);
            combinedData_.slotPoints_.push_back(point_depth_start.y);
            combinedData_.slotPoints_.push_back(point_depth_end.x);
            combinedData_.slotPoints_.push_back(point_depth_end.y);

            ROS_DEBUG("Fusion-timestamp:%ld, slots size:%u, num:%d, type:%d, state:%d,is_new:%d,"
                     "slot_id:%d, count:%ld, target_id:%d, delay_time:%ld,"
                     "points[(%lf, %lf), (%lf, %lf), (%lf, %lf)]",
                     msg->timestamp, msg->polygonStamped.size(), msg->num, msg->type[i], msg->state[i],
                     msg->is_new[i], msg->slot_id[i],
                     msg->count, msg->target_id, msg->delay_time,
                     point_start.x, point_start.y, point_end.x, point_end.y,
                     point_depth_start.x, point_depth_start.y, point_depth_end.x, point_depth_end.y);
        } else {
            for (int i = 0; i < 8; ++i) {
                combinedData_.slotPoints_.push_back(0.0f);
            }
        }
    }

    combinedData_.readyFlag |= SLOT_FUSION_INFO();
    if (combinedData_.isReady()) {
        onOneFrameReady(combinedData_);
        combinedData_.clearReadyFlag();
        combinedData_.clearData();
    }
}
#else
void MessagesHub::workLoop() {
    float pointStartVX = 1500;
    float pointStartVY = -2000;
    float pointEndVX = 4000;
    float pointEndVY = -2000;
    float pointDepthStartVX = 1500;
    float pointDepthStartVY = -7000;
    float pointDepthEndVX = 4000;
    float pointDepthEndVY = -7000;


    float pointStartHX = -2500;
    float pointStartHY = 2000;
    float pointEndHX = 2000;
    float pointEndHY = 2000;
    float pointDepthStartHX = -2500;
    float pointDepthStartHY = 4000;
    float pointDepthEndHX = 2000;
    float pointDepthEndHY = 4000;
    float distance = -3500;
    float distanceV = -5500;
    int loopCount = 0;
 #if 0
    std::ifstream dataFile("d:\\temp\\log_0227.data", std::ios::binary | std::ios::in);
    if (dataFile) {
        while (dataFile.read((char*)&combinedData_, sizeof(CombinedData))) {
            combinedData_.readyFlag |= SLOT_FUSION_INFO();
            combinedData_.readyFlag |= VEHICLE_INFO();
            onOneFrameReady(combinedData_);
            if (combinedData_.slotId_ != -1  && combinedData_.pointStartX_ != -1) {
                QThread::msleep(100);
            }
        }

        dataFile.close();
    }
#endif

#if 0
    combinedData_.vehicleSpeed_ = 0.4;
    combinedData_.yawSpeed_ = 0;
    combinedData_.carAngle_ = 0;
    while (true) {
        combinedData_.timestamp_ = QDateTime::currentDateTime().currentMSecsSinceEpoch();

      //  srand((unsigned)time(NULL));
       // int num = rand() % 4 + 1;
        if (loopCount >= 2 && combinedData_.carAngle_ < 3.14 / 3) {
            combinedData_.yawSpeed_ = 0.3;
            combinedData_.carAngle_ += 0.3;
           // combinedData_.vehicleSpeed_ += 0.1;
        } else if (combinedData_.carAngle_ >= 3.14 / 3) {
            combinedData_.yawSpeed_ = 0;
            combinedData_.carAngle_ = 0;
        }


        int numleft = 1;
        for (int i = 0; i < numleft; ++i) {
            combinedData_.num_ = numleft;
            combinedData_.slotId_ = i + 1;
            combinedData_.state_ = (i + 1) % 2 == 0 ? 1 : 2;
            combinedData_.type_ =  2;
            combinedData_.isNew_ = 2;

            combinedData_.pointStartX_ = pointStartHX + i * distanceV;
            combinedData_.pointStartY_ = pointStartHY;
            combinedData_.pointEndX_ = pointEndHX + i * distanceV;
            combinedData_.pointEndY_ = pointEndHY;
            combinedData_.pointDepthStartX_ = pointDepthStartHX + i * distanceV;
            combinedData_.pointDepthStartY_ = pointDepthStartHY;
            combinedData_.pointDepthEndX_ = pointDepthEndHX + i * distanceV;
            combinedData_.pointDepthEndY_ = pointDepthEndHY;

            combinedData_.readyFlag |= SLOT_FUSION_INFO();
            combinedData_.readyFlag |= VEHICLE_INFO();
            onOneFrameReady(combinedData_);
        }

        int numright = 1;

        for (int i = 0; i < numright; ++i) {
            combinedData_.num_ = numright;
            combinedData_.slotId_ = i + numleft + 1;
            combinedData_.state_ = (i + 1) % 2 == 0 ? 1 : 2;
            combinedData_.type_ =  1;
            combinedData_.isNew_ = 2;

            combinedData_.pointStartX_ = pointStartVX + i * distance;
            combinedData_.pointStartY_ = pointStartVY;
            combinedData_.pointEndX_ = pointEndVX + i * distance;
            combinedData_.pointEndY_ = pointEndVY;
            combinedData_.pointDepthStartX_ = pointDepthStartVX + i * distance;
            combinedData_.pointDepthStartY_ = pointDepthStartVY;
            combinedData_.pointDepthEndX_ = pointDepthEndVX + i * distance;
            combinedData_.pointDepthEndY_ = pointDepthEndVY;

            combinedData_.readyFlag |= SLOT_FUSION_INFO();
            combinedData_.readyFlag |= VEHICLE_INFO();
            onOneFrameReady(combinedData_);
        }

        QThread::msleep(5000);

        loopCount++;
    }

#else
        loopCount = 20;
        combinedData_.vehicleSpeed_ = 0.4f;
        combinedData_.timestamp_ = QDateTime::currentDateTime().currentMSecsSinceEpoch();
        combinedData_.carAngle_ = 0;
        combinedData_.num_ = 1;
        while (true) {
            std::unique_lock<std::mutex> lk(sigMutex);
            cond.wait(lk);
            combinedData_.slotId_ = loopCount;
            combinedData_.yawSpeed_ = 0;

            combinedData_.carAngle_ = 0;
            combinedData_.state_ = 2;
            combinedData_.type_ = 1;
            combinedData_.isNew_ = 2;
            combinedData_.pointStartX_ = pointStartVX ;
            combinedData_.pointStartY_ = pointStartVY;
            combinedData_.pointEndX_ = pointEndVX;
            combinedData_.pointEndY_ = pointEndVY;
            combinedData_.pointDepthStartX_ = pointDepthStartVX;
            combinedData_.pointDepthStartY_ = pointDepthStartVY;
            combinedData_.pointDepthEndX_ = pointDepthEndVX;
            combinedData_.pointDepthEndY_ = pointDepthEndVY;
            loopCount++;
            onOneFrameReady(combinedData_);
        }
#endif
}
#endif
void MessagesHub::addOneObject() {
    qDebug() << "Signal add one object...";
    std::lock_guard<std::mutex> lk(sigMutex);
    cond.notify_one();
}
void MessagesHub::onOneFrameReady(const CombinedData& combinedData) {
 //          QThread::msleep(1000);
    for (const auto& o : observers_) {
        qDebug() << "biwenyang:onOneFrameReady, notify observer...";
        QMetaObject::invokeMethod(o.get() , "onUpdate" , Qt::AutoConnection
            , Q_ARG(CombinedData, combinedData));
    }
}
}
