# hyperledger-blockchain-project
# Blockchain ile Müşteri Sadakat Api

![Müşteri Sadakat Api](https://www.altoros.com/blog/wp-content/uploads/2017/04/IBM-Blockchain-Hyperledger-Fabric-Composer-Open-Source-Toolset.png "Müşteri Sadakat Api")

# Kullanılan Teknolojiler
- Hyperledger Explorer 0.3.4
- Hyperledger Composer CLI 0.9.4
- Hyperledger Rest Server 0.19.4
- Generator Hyperledger Composer 0.19.4
- Yeoman
- Go 1.11.7
- PostgreSQL 11.2
- Composer Playground 0.19.4
- Hyperledger Fabric 1.1.0
- Docker Engine 18.09.2
- Docker-Compose 1.23.2
- Node 8.15.1
- Npm 6.4.1
- Nvm 0.33.0
- Git 2.20.1
- Python 2.7.10


# Kurulum Gereksinimleri

- Hyperledger Explorer 0.3.4
- Hyperledger Fabric 1.1.0
- Hyperledger Composer 0.19.x
- PostgreSQL 9.5 or greater
- Go 1.11.x
- Operating Systems: Ubuntu Linux 14.04 / 16.04 LTS (both 64-bit), or Mac OS 10.12 or higher
- Docker Engine: Version 17.03 or higher
- Docker-Compose: Version 1.8 or higher
- Node: 8.9 or higher (note version 9 is not supported)
- npm: v5.x
- git: 2.9.x or higher
- Python: 2.7.x

Müşteri sadakat programı, şirketlerin sık alım yapan müşterilerini ödüllendirmelerini sağlar. Program üyeleri, indirim, ücretsiz veya özel müşteri muamelesi gibi bir çeşit ödüle dönüşebilecek alımlarda puan kazanabilirler.
Üyeler, ödüllerini almak için belirli bir noktaya çalışırlar. Bu programlarda bir müşteri tabanına hizmet vermek için programda Şirket olarak birden fazla şirkete sahip olabilir. Ancak, bu sistem ilişkiler üzerinde durmaktadır.
Müşteri sadakat programı için bu blok zincirleme modeli, sadakat programı üyelerine puanların değerini arttırır ve güvenilir işlemler oluşturarak Şirketlere yeni değerler getirir. Bu ağa katılanların  birbirleri arasında daha fazla seviyeli ilişkisi vardır ve puanlar tüm katılımcıları birbirine bağlamak için merkezî konumdadır.
Bu kod modelinde, Hyperledger Composer API ve Node.js kullanarak bir blockchain web uygulaması olarak müşteri sadakat programı oluşturacağız. Uygulama, üyelerin hesaplarını oluşturacakları ağa kaydolmalarına izin verecektir.
Ağ üzerinde hesap numaralarıyla tanımlanacak ve oturum açmak için kullanacakları bir erişim anahtarı oluşturulacaktır. Bu erişim anahtarı, üyenin işlem yapmak veya kayıtları sorgulamak için kimlik kartı olarak kullanılır.Üye bir kez oturum açtığında, puan kazanmak için işlemler yapabilir ve ağdaki şirketlerden puan alabilir. İşlemlerini blockchain defterinin bir parçası olarak görebilirler. Bu kod kalıbı, bir üyenin işlemlerini yalnızca görebileceği ağın bir parçası olarak izinlerin kullanımını gösterir.
Şirket için benzer şekilde, ağda bir kimlik ve kayıtlarını görüntülemek için kullanılacak bir erişim anahtarı oluşturarak kayıt olurlar. Şirketlerinizin yalnızca parçası oldukları işlemleri görmelerine izin verilir ve böylece puanları tahsis ettikleri veya kullandıkları tüm işlemlerini takip edebilirler. Web uygulaması, şirket için ayırdıkları ve üyelere kullandıkları toplam puanları gösteren temel bir gösterge tablosunu gösterir. İşlemler karmaşıklaştıkça, şirketi bilgilendirici panolar oluşturmak için işlemlerini analiz edebilir.

Bu API, Hyperledger Composer ile blockchain uygulamaları oluşturmaya başlamak isteyen geliştiriciler içindir. Okuyucu bu kod şablonunu tamamladığında, nasıl yapılacağını anlar.

* Hyperledger Composer çerçevesini kullanarak temel işletme ağı oluşturma
* Ağ yerel olarak  Hyperledger Fabric örneğine dağıtılır
* Composer API kullanarak blockchain ağı ile etkileşimde bulunmak için bir Node.js web uygulaması oluşturur.



**Not** Blockchain ağının birden fazla üyesi ve ortağı olacak

1. Üyeler ağa kayıt olmalıdır.
2. Üyeler puan kazanmak ve işlemlerini görüntülemek için giriş yapmalıdır.
3. Şirketler ağa kayıt olmalıdır.
4. Şirketler, işlemlerini görüntülemek ve gösterge tablosunu görüntülemek için oturum aaçmalıdır.


# Kullanılan Bileşenler

* [Hyperledger Composer v0.19.4](https://hyperledger.github.io/composer/latest/) Hyperledger Composer, blockchain uygulamalarını geliştirmeyi kolaylaştıran kapsamlı, açık bir geliştirme araç seti ve çerçevesidir.
* [Hyperledger Fabric v1.1](https://hyperledger-fabric.readthedocs.io) Hyperledger Fabric, yüksek seviyede gizlilik, esneklik ve ölçeklenebilirlik sağlayan modüler bir mimarinin desteklediği, dağıtılmış bir platformdur.