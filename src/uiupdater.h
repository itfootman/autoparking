_Pragma("once");
#include "messageshub/observer.h"
namespace hmi {
class UIUpdater : public Observer {
public:
    UIUpdater() {}
    ~UIUpdater() {}

    void onUpdate(const CombinedData& combinedData) override;
};
} /* namespace hmi */
