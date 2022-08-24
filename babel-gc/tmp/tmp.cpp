#include <QtCore>
#include <QtGui>
#include <QtWidgets>
#include "utf8LogHandler.h"
#include "debug_line.h"
//#include "jnetwork.h"

#include <iostream>
#include <memory>

class A {
public:
    explicit A() {
        std::cout << "A()" << std::endl;
    }
    A(const double n) {
        std::cout << "A()" << n << std::endl;
    }
    ~A() {
        std::cout << "~A()" << std::endl;
    }
};

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);
    qInstallMessageHandler(utf8LogHandler);
    qdebug_line1("Hello World!");
    //JNetworkManager nm;
    //qDebug().noquote() << nm.getBatchAsText(QUrl("https://raw.githubusercontent.com/cyginst/cyginst-v1/master/cyginst.bat"));

    // newしたポインタをshared_ptrオブジェクトに管理させる
    // 所有者は1人。
    std::shared_ptr<int> p1(new int(3));

    {
        // shared_ptrオブジェクトをコピーすることで、
        // 複数のオブジェクトが一つのリソースを共有できる。
        // 所有者が2人になる。
        std::shared_ptr<int> p2 = p1;

        // 共有しているリソースにアクセスする
        std::cout << *p2 << std::endl;
    } // p2のデストラクタが実行される。
    // リソースの所有者が1人になる。
    // ここではまだ、リソースは解放されない。

    std::cout << *p1 << std::endl;

    auto a = std::make_shared<A>();

    A a2 = 1.23;

    return 0; // return app.exec();
}
