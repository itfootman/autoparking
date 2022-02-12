#include "uiupdater.h"
#include <iostream>
#include <QtCore>

namespace hmi {
void UIUpdater::onUpdate(const CombinedData& combinedData) {
    qDebug()  << "CombinedData-timestamp:" << combinedData.timestamp()
              << ", num: " << combinedData.num() << ", slotId:" << combinedData.slotId()
              << ", points(" << combinedData.pointStartX() << "," << combinedData.pointStartY()
              << "," << combinedData.pointEndX() << "," << combinedData.pointEndY()
              << "," << combinedData.pointDepthStartX() << "," << combinedData.pointDepthStartY()
              << "," << combinedData.pointDepthEndX() << "," << combinedData.pointDepthEndY() << ")"
              << "," << "vehicleSpeed:" << combinedData.vehicleSpeed()
              << "," << "yawSpeed:" << combinedData.yawSpeed();
    emit combinedDataUpdated(combinedData);

}
} /* namespace hmi */
