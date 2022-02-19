#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QSurfaceFormat>
#include <QQuick3D>
#include <QResource>
#include <QQmlContext>
#include <QQuickView>
#include <QQuickItem>
#include <QQmlComponent>
#ifdef WITH_ROS
#include "ros/ros.h"
#endif
#include "messageshub/messages_hub.h"
#include "uiupdater.h"

int main(int argc, char *argv[])
{
    using namespace hmi;

#ifdef WITH_ROS
    ros::init(argc, argv, "autoparking");
#endif
#if QT_VERSION < QT_VERSION_CHECK(6, 0, 0)
    QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);
#endif
    QGuiApplication app(argc, argv);
    QQuickView view;
    view.engine()->addImportPath("qrc:/qml/asset_imports");
    view.engine()->addImportPath("qrc:/qml/imports");
    view.engine()->addImportPath("qrc:/qml/imports_js");

    bool result = QResource::registerResource(app.applicationDirPath() + "/qml.rcc");
    if (result) {
        qDebug() << "register resource success.";
    } else {
        qDebug() << "register resource failed.";
    }


    qmlRegisterType<UIUpdater>("hmi.autoparking", 1, 0,
                                 "UIUpdater");
    //qRegisterMetaType<CombinedData>("CombinedData");
    QQmlComponent component(view.engine(), QUrl("qrc:/qml/AutoParkingData.qml"));
    auto *uiupdater = qobject_cast<UIUpdater *>(component.create());
    view.engine()->rootContext()->setContextProperty("uiupdater", uiupdater);

    view.setSource(QUrl("qrc:/qml/main.qml"));
    view.show();

//    if (uiUpdater != nullptr) {
        MessagesHub messagesHub;
        std::shared_ptr<UIUpdater> uiUpdater(uiupdater);
        messagesHub.addObserver(uiUpdater);
        messagesHub.plugIn();
//    } else {
//        qDebug() << "No UIUpdater found...";
//    }


        QQuickItem* object = view.rootObject();
        //auto* adas = object->findChild<QQuickItem*>("adas");

        //if (adas != nullptr) {
        qDebug() << "Connect signal...";
        QObject::connect(object, SIGNAL(signalAddObject()),
                         &messagesHub, SLOT(addOneObject()));
       // }
    return app.exec();
    qDebug() << "Main exit...";
}
