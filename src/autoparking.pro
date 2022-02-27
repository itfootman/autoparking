QT += quick quick3d 3drender 3dinput 3dquick 3dlogic qml quick 3dquickextras 3dextras
# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
        main.cpp \
        messageshub/messages_hub.cpp \
        messageshub/observer.cpp \
        uiupdater.cpp

#INCLUDEPATH = mess
RCC_BINARY_SOURCES += qml.qrc

# Additional import path used to resolve QML modules in Qt Creator's code model
QML_IMPORT_PATH = qml/asset_imports qml/imports qml/imports_js

# Additional import path used to resolve QML modules just for Qt Quick Designer
QML_DESIGNER_IMPORT_PATH =

message("qmake PWD = $$PWD")
message("qmake QT_HOST_BINS = $$[QT_HOST_BINS]")
message("qmake OUT_PWD = $$OUT_PWD")

OTHER_FILES += $$RCC_BINARY_SOURCES

resource_build.input = OTHER_FILES
resource_build.output = qml.rcc
resource_build.depends = $$PWD/qml.qrc FORCE
resource_build.CONFIG += target_predeps no_link

unix:!macx{
    resource_build.commands = $$[QT_HOST_BINS]/rcc -binary -no-compress ${QMAKE_FILE_NAME} -o $$OUT_PWD/qml.rcc
}
win32 {
    CONFIG(debug, debug|release) {
        resource_build.commands = $$[QT_HOST_BINS]/rcc -binary -no-compress ${QMAKE_FILE_NAME} -o $$OUT_PWD/debug/qml.rcc
    }

    CONFIG(release, debug|release) {
        resource_build.commands = $$[QT_HOST_BINS]/rcc -binary -no-compress ${QMAKE_FILE_NAME} -o $$OUT_PWD/release/qml.rcc
    }
}

QMAKE_DISTCLEAN += $$OUT_PWD/debug/qml.rcc
#extraclean.commands = rm -rf $$OUT_PWD/debug/cluster.rcc $$OUT_PWD/release/cluster.rcc

QMAKE_EXTRA_COMPILERS += resource_build

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

HEADERS += \
    messageshub/combined_data.h \
    messageshub/messages_hub.h \
    messageshub/observer.h \
    uiupdater.h
