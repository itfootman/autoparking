#include "uiupdater.h"
#include <iostream>
#include <sstream>
#include <fstream>
#include <QtCore>

namespace hmi {
void UIUpdater::onUpdate(const CombinedData& combinedData) {
//    qDebug()  << "CombinedData-timestamp:" << combinedData.timestamp()
//              << ", num: " << combinedData.num() << ", slotId:" << combinedData.slotId()
//              << ", state: " << combinedData.state() << ", isNew:" << combinedData.isNew()
//              << ", points(" << combinedData.pointStartX() << "," << combinedData.pointStartY()
//              << "," << combinedData.pointEndX() << "," << combinedData.pointEndY()
//              << "," << combinedData.pointDepthStartX() << "," << combinedData.pointDepthStartY()
//              << "," << combinedData.pointDepthEndX() << "," << combinedData.pointDepthEndY() << ")"
//              << "," << "vehicleSpeed:" << combinedData.vehicleSpeed()
//              << "," << "yawSpeed:" << combinedData.yawSpeed();
    emit combinedDataUpdated(combinedData);

//   static std::ofstream myfile("log_50s.data", std::ios::out | std::ios::binary);
//   if(!myfile) {
//       std::cout << "Cannot open file!" << std::endl;
//   } else {
//       myfile.write((const char*)&combinedData, sizeof(CombinedData));
//       if(!myfile.good()) {
//          std::cout << "Error occurred at writing time!" << std::endl;
//       }
//       myfile.flush();
//   }


//   static std::ofstream myfile("timestamp.txt", std::ios::out);
//   if(!myfile) {
//       std::cout << "Cannot open file!" << std::endl;
//   } else {
//       std::ostringstream ssm;
//       ssm << combinedData.timestamp() << "\n";
//       myfile.write(ssm.str().c_str(), ssm.str().length());
//       if(!myfile.good()) {
//          std::cout << "Error occurred at writing time!" << std::endl;
//       }
//       myfile.flush();
//   }
}
} /* namespace hmi */
