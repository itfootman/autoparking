#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QSurfaceFormat>
#include <QQuick3D>
#include <QResource>
#include <QQmlContext>
#include "ros/ros.h"
#include "messageshub/messages_hub.h"

int main(int argc, char *argv[])
{
    using namespace hmi;
    ros::init(argc, argv, "autoparking");
#if QT_VERSION < QT_VERSION_CHECK(6, 0, 0)
    QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);
#endif
    QGuiApplication app(argc, argv);
    QQmlApplicationEngine engine;
    engine.addImportPath("qrc:/qml/asset_imports");
    engine.addImportPath("qrc:/qml/imports");

    bool result = QResource::registerResource(app.applicationDirPath() + "/qml.rcc");
    if (result) {
        qDebug() << "register resource success.";
    } else {
        qDebug() << "register resource failed.";
    }
    engine.rootContext()->setContextProperty("applicationDirPath", app.applicationDirPath());
    engine.load(QUrl("qrc:/qml/main.qml"));
    MessagesHub messagesHub;
    messagesHub.plugIn();

    return app.exec();
}
