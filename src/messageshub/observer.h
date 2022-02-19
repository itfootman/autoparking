_Pragma("once");
#include <QObject>
#include "combined_data.h"

namespace hmi {
class Observer : public QObject {
    Q_OBJECT
public:
    Observer();
    virtual ~Observer();

public slots:
   virtual void onUpdate(const CombinedData& combinedData) = 0;
};
    
} /* namespace hmi */
