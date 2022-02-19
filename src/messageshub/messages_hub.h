_Pragma("once");

#include <thread>
#include <mutex>

#ifdef WITH_ROS
#include "ros/ros.h"
#include "geometry_msgs/Point32.h"
#include "autoparking/fusion_info.h"
#include "autoparking/vehicle_info.h"
#endif
#include "combined_data.h"
#include "observer.h"

namespace hmi {
class MessagesHub {
public:
    MessagesHub();
    ~MessagesHub();

    void plugIn();
    void addObserver(const std::shared_ptr<Observer>& observer);
    void removeObserver(const std::shared_ptr<Observer>& obsrver);
    
private:
#ifdef WITH_ROS
    void onVehicleMessage(const autoparking::vehicle_infoConstPtr& msg);
    void onSlotFusionMessage(const autoparking::fusion_infoConstPtr& msg);
#endif
    void workLoop();
    void onOneFrameReady(const CombinedData& combinedData);

    std::unique_ptr<std::thread> workThread_;
    std::mutex observerMutex_;
    CombinedData combinedData_;
    int32_t lastSlotId = -1;
    std::vector<std::shared_ptr<Observer>> observers_;
};
}

