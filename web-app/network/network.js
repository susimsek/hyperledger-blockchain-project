const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');

//Ad alanını bildir
const namespace = 'org.clp.biznet';

//Testler için hafıza içi kart deposu, kartlar dosya sistemine bağlı kalmaz
const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore( { type: 'composer-wallet-inmemory' } );

//İş ağını dağıtmak için kullanılan blok zincirle yönetici bağlantısı
let adminConnection;

//Bu, testlerin kullanacağı iş ağı bağlantısıdır.
let businessNetworkConnection;

let businessNetworkName = 'clp-network';
let factory;


/*
 * Kimlik için kartı al
 */
async function importCardForIdentity(cardName, identity) {

  //Yönetici bağlantısını kullan
  adminConnection = new AdminConnection();
  businessNetworkName = 'clp-network';

  //meta veri bildir
  const metadata = {
      userName: identity.userID,
      version: 1,
      enrollmentSecret: identity.userSecret,
      businessNetwork: businessNetworkName
  };

  //json'dan bağlantı profili al, Kimlik Kartı oluştur
  const connectionProfile = require('./local_connection.json');
  const card = new IdCard(metadata, connectionProfile);

  //Card ekleme
  await adminConnection.importCard(cardName, card);
}


/*
* Farklı bir kimlik kullanarak yeniden bağlan
*/
async function useIdentity(cardName) {

  //Mevcut bağlantının bağlantısını kes
  await businessNetworkConnection.disconnect();

  //cardName kullanarak ağa bağlan
  businessNetworkConnection = new BusinessNetworkConnection();
  await businessNetworkConnection.connect(cardName);
}


//Dış modül
module.exports = {

  /*
  * Üye katılımcısı oluşturun ve kimlik için kart alın
  */
 registerMember: async function (cardId, accountNumber,firstName, lastName, email, phoneNumber) {
    try {

      //Admin olarak bağlan
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@clp-network');

      //İş ağı için factory kurmak
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //Üye ekleme
      const member = factory.newResource(namespace, 'Member', accountNumber);
      member.firstName = firstName;
      member.lastName = lastName;
      member.email = email;
      member.phoneNumber = phoneNumber;
      member.points = 0;

      //Üye katılımcısı ekle
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Member');
      await participantRegistry.add(member);

      //Sorun kimliği
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.Member#' + accountNumber, cardId);

      //Limlik için dış kartı
      await importCardForIdentity(cardId, identity);

      //Bağlantı kesme
      await businessNetworkConnection.disconnect('admin@clp-network');

      return true;
    }
    catch(err) {
      //Dönüş hatası
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

  /*
  * Ortak katılımcı oluşturun ve kimlik için kart alın
  */
  registerPartner: async function (cardId, partnerId, name) {

    try {

      //Admin girişi
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@clp-network');

      //İş ağı için factory alma
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //Şirket katılımcısı oluştur
      const partner = factory.newResource(namespace, 'Partner', partnerId);
      partner.name = name;

      //Ortak katılımcı ekle
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Partner');
      await participantRegistry.add(partner);

      //Sorun kimliği
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.Partner#' + partnerId, cardId);

      //kimlik  kartı
      await importCardForIdentity(cardId, identity);

      //Bağlantı kesme
      await businessNetworkConnection.disconnect('admin@clp-network');

      return true;
    }
    catch(err) {
      //Dönüş hatası
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

  /*
  * Puan kazanma işlemini gerçekleştirin
  */
  earnPointsTransaction: async function (cardId, accountNumber, partnerId, points) {

    try {

      //cardId ile ağa bağlan
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //iş ağı için factory almak.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //İşlem oluştur
      const earnPoints = factory.newTransaction(namespace, 'EarnPoints');
      earnPoints.points = points;
      earnPoints.member = factory.newRelationship(namespace, 'Member', accountNumber);
      earnPoints.partner = factory.newRelationship(namespace, 'Partner', partnerId);

      //İşlem gönder
      await businessNetworkConnection.submitTransaction(earnPoints);

      //Bağlantı kesme
      await businessNetworkConnection.disconnect(cardId);

      return true;
    }
    catch(err) {
      //Dönüş Hatası
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

  /*
  * Kullanım Puanı İşlemi Yap
  */
  usePointsTransaction: async function (cardId, accountNumber, partnerId, points) {

    try {

      //cardId ile ağa bağlan
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //iş ağı için factory almak.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //İşlem oluştur
      const usePoints = factory.newTransaction(namespace, 'UsePoints');
      usePoints.points = points;
      usePoints.member = factory.newRelationship(namespace, 'Member', accountNumber);
      usePoints.partner = factory.newRelationship(namespace, 'Partner', partnerId);

      //İşlem gönder
      await businessNetworkConnection.submitTransaction(usePoints);

      //Bağlantı kesme
      await businessNetworkConnection.disconnect(cardId);

      return true;
    }
    catch(err) {
      //Dönüş hatası
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  },

  /*
  * Üye verilerini al
  */
  memberData: async function (cardId, accountNumber) {

    try {

      //cardId ile ağa bağlan
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //Ağdan üye almak
      const memberRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Member');
      const member = await memberRegistry.get(accountNumber);

      //Bağlantı kesme
      await businessNetworkConnection.disconnect(cardId);

      //Üye nesneyi döndür
      return member;
    }
    catch(err) {
      //Dönüş hatası
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

  /*
  * Partner verilerini al
  */
  partnerData: async function (cardId, partnerId) {

    try {

      //cardId ile ağa bağlan
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //Ağdan üye almak
      const partnerRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Partner');
      const partner = await partnerRegistry.get(partnerId);

      //Bağlantı kesme
      await businessNetworkConnection.disconnect(cardId);

      //Dönüş ortak nesnesi
      return partner;
    }
    catch(err) {
      //Dönüş hatası
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  },

  /*
  * Tüm ortakların verilerini al
  */
  allPartnersInfo : async function (cardId) {

    try {
      //cardId ile ağa bağlan
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //Ağdaki tüm ortakları sorgula
      const allPartners = await businessNetworkConnection.query('selectPartners');

      //Bağlantı kesme
      await businessNetworkConnection.disconnect(cardId);

      //allPartners nesnesini döndür
      return allPartners;
    }
    catch(err) {
      //Dönüş hatası
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  /*
  * Tüm Kazanç Puan işlem verilerini al
  */
  earnPointsTransactionsInfo: async function (cardId) {

    try {
      //cardId ile ağa bağlan
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //Ağdaki Puan Kazanma İşlemlerini sorgula
      const earnPointsResults = await businessNetworkConnection.query('selectEarnPoints');

      //Bağlantı kesme
      await businessNetworkConnection.disconnect(cardId);

      //Kazanılan puan sonuçlarını döndür
      return earnPointsResults;
    }
    catch(err) {
      //Dönüş hatası
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  },

  /*
  * Tüm Kullanım Puanları işlem verilerini al
  */
  usePointsTransactionsInfo: async function (cardId) {

    try {
      //cardId ile ağa bağlan
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //Ağdaki Puan Kazanma İşlemlerini sorgula
      const usePointsResults = await businessNetworkConnection.query('selectUsePoints');

      //Bağlantı kesme
      await businessNetworkConnection.disconnect(cardId);

      //Kazanılan puan sonuçlarını döndür
      return usePointsResults;
    }
    catch(err) {
      //Dönüş hatası
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  }

}
