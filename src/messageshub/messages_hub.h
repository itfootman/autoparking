_Pragma("once")

#include <thread>
#include "ros/ros.h"                          
#include "geometry_msgs/Point32.h"            
#include "autoparking/fusion_info.h"    
#include "autoparking/vehicle_info.h"    
#include "combined_data.h"

namespace hmi {
class MessagesHub {
public:
    MessagesHub();
    ~MessagesHub();

    void plugIn();
    
private:
    void onVehicleMessage(const autoparking::vehicle_infoConstPtr& msg);
    void onSlotFusionMessage(const autoparking::fusion_infoConstPtr& msg);
    void onOneFrameReady(const CombinedData& combinedData);
    void workLoop();

    std::unique_ptr<std::thread> workThread_;
    CombinedData combinedData_;
    int32_t lastSlotId = -1;
};
}

