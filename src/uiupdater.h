_Pragma("once");
#include <qqml.h>
#include <QObject>
#include "messageshub/observer.h"
namespace hmi {
class UIUpdater : public Observer {
    Q_OBJECT
//       Q_PROPERTY(CombinedData combinedData READ combinedData NOTIFY combinedDataChanged)
//       QML_ELEMENT
public:
    UIUpdater() {}
    ~UIUpdater() {}

    void onUpdate(const CombinedData& combinedData) override;

signals:
    void combinedDataUpdated(const CombinedData& combinedData);
};
} /* namespace hmi */
