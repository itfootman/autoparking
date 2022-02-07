#include "uiupdater.h"
#include <iostream>

namespace hmi {
void UIUpdater::onUpdate(const CombinedData& combinedData) {
    std::cout << "CombinedData-timestamp:" << combinedData.timestamp
              << ", num: " << combinedData.num << ", slotId:" << combinedData.slotId
              << ", points(" << combinedData.pointStartX << "," << combinedData.pointStartY
              << "," << combinedData.pointEndX << "," << combinedData.pointEndY
              << "," << combinedData.pointDepthStartX << "," << combinedData.pointDepthStartY
              << "," << combinedData.pointDepthEndX << "," << combinedData.pointDepthEndY << ")"
              << "," << "vehicleSpeed:" << combinedData.vehicleSpeed
              << "," << "yawSpeed:" << combinedData.yawSpeed << std::endl;

}
} /* namespace hmi */
