#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QSurfaceFormat>
#include <QQuick3D>
#include <QResource>
#include <QQmlContext>
#include <QQuickView>
#include <QQuickItem>
#include "ros/ros.h"
#include "messageshub/messages_hub.h"
#include "uiupdater.h"

int main(int argc, char *argv[])
{
    using namespace hmi;
    ros::init(argc, argv, "autoparking");
#if QT_VERSION < QT_VERSION_CHECK(6, 0, 0)
    QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);
#endif
    QGuiApplication app(argc, argv);
    QQuickView view;
    view.engine()->addImportPath("qrc:/qml/asset_imports");
    view.engine()->addImportPath("qrc:/qml/imports");

    bool result = QResource::registerResource(app.applicationDirPath() + "/qml.rcc");
    if (result) {
        qDebug() << "register resource success.";
    } else {
        qDebug() << "register resource failed.";
    }

    view.engine()->rootContext()->setContextProperty("applicationDirPath", app.applicationDirPath());
    qmlRegisterType<UIUpdater>("hmi.autoparking", 1, 0,
                                 "UIUpdater");
    qRegisterMetaType<CombinedData>();

    view.setSource(QUrl("qrc:/qml/main.qml"));
    view.show();
    QQuickItem* object = view.rootObject();
    UIUpdater* uiUpdater = object->findChild<UIUpdater*>("uiupdater");
    if (uiUpdater != nullptr) {
        MessagesHub messagesHub;
        std::shared_ptr<UIUpdater> uiUpdater = std::make_shared<UIUpdater>();
        messagesHub.addObserver(uiUpdater);
        messagesHub.plugIn();
    } else {
        qDebug() << "No UIUpdater found...";
    }

    return app.exec();
    qDebug() << "Main exit...";
}
