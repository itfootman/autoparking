#include "observer.h"
namespace hmi {
Observer::Observer() : QObject(nullptr) {}
Observer::~Observer() {}
void Observer::onUpdate(const CombinedData& combinedData) {
}
} /* namespace hmi */
