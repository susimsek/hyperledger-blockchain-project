'use strict';

//Kütüphaneleri getirme
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path')

//Ekspres web uygulaması oluşturma
const app = express();
const router = express.Router();

var network = require('./network/network.js');
var validate = require('./network/validate.js');
var analysis = require('./network/analysis.js');

//Önyükleme uygulaması ayarları
app.use(express.static('./public'));
app.use('/scripts', express.static(path.join(__dirname, '/public/scripts')));
app.use(bodyParser.json());

//Ana sayfayı alma
app.get('/home', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

//Üye sayfasını alma
app.get('/member', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/member.html'));
});

//Üye kayıt sayfasını alma
app.get('/registerMember', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/registerMember.html'));
});

//Ortak sayfa alma
app.get('/partner', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/partner.html'));
});

//Ortak kayıt sayfasını alma
app.get('/registerPartner', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/registerPartner.html'));
});

//Hakkında sayfası
app.get('/about', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/about.html'));
});


//Ağdaki üyeyi kaydetmek için çağrı gönder
app.post('/api/registerMember', function(req, res) {

  //İstekten alınacak değişkenleri bildir
  var accountNumber = req.body.accountnumber;
  var cardId = req.body.cardid;
  var firstName = req.body.firstname;
  var lastName = req.body.lastname;
  var email = req.body.email;
  var phoneNumber = req.body.phonenumber;

  //Değişkenleri yazdır
  console.log('Using param - firstname: ' + firstName + ' lastname: ' + lastName + ' email: ' + email + ' phonenumber: ' + phoneNumber + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);

  //Üye kayıt alanlarını doğrula
  validate.validateMemberRegistration(cardId, accountNumber, firstName, lastName, email, phoneNumber)
    .then((response) => {
      //Cevapta hata varsa hata döndür
      if (response.error != null) {
        res.json({
          error: response.error
        });
        return;
      } else {
        //başka üye ağında üye ol
        network.registerMember(cardId, accountNumber, firstName, lastName, email, phoneNumber)
          .then((response) => {
            //Cevapta hata varsa hata döndür
            if (response.error != null) {
              res.json({
                error: response.error
              });
            } else {
              //Aksi takdirde başarıyı geri getir
              res.json({
                success: response
              });
            }
          });
      }
    });


});

//Ağdaki ortağı kaydetmek için arama sonrası
app.post('/api/registerPartner', function(req, res) {

  //İstekten alınacak değişkenleri bildir
  var name = req.body.name;
  var partnerId = req.body.partnerid;
  var cardId = req.body.cardid;

  //Değişkenleri yazdır
  console.log('Using param - name: ' + name + ' partnerId: ' + partnerId + ' cardId: ' + cardId);

  //İş ortağı kayıt alanlarını doğrula
  validate.validatePartnerRegistration(cardId, partnerId, name)
    .then((response) => {
      //Cevapta hata varsa hata döndür
      if (response.error != null) {
        res.json({
          error: response.error
        });
        return;
      } else {
        //Başka bir ağ üzerinde ortak kayıt ol
        network.registerPartner(cardId, partnerId, name)
          .then((response) => {
            //Cevapta hata varsa hata döndür
            if (response.error != null) {
              res.json({
                error: response.error
              });
            } else {
              //Aksi takdirde başarıyı geri getir
              res.json({
                success: response
              });
            }
          });
      }
    });

});

//Şebeke üzerinde Puan Kazanma işlemi gerçekleştirmek için çağrı sonrası
app.post('/api/earnPoints', function(req, res) {

  //İstekten alınacak değişkenleri bildir
  var accountNumber = req.body.accountnumber;
  var cardId = req.body.cardid;
  var partnerId = req.body.partnerid;
  var points = parseFloat(req.body.points);

  //Değişkenleri yazdır
  console.log('Using param - points: ' + points + ' partnerId: ' + partnerId + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);

  //Puan alanını doğrula
  validate.validatePoints(points)
    .then((checkPoints) => {
      //Cevapta hata varsa hata döndür
      if (checkPoints.error != null) {
        res.json({
          error: checkPoints.error
        });
        return;
      } else {
        points = checkPoints;
        //Ağda Puan Kazanma işlemi gerçekleştirdi
        network.earnPointsTransaction(cardId, accountNumber, partnerId, points)
          .then((response) => {
            //Cevapta hata varsa hata döndür
            if (response.error != null) {
              res.json({
                error: response.error
              });
            } else {
              //Aksi takdirde başarıyı geri getir
              res.json({
                success: response
              });
            }
          });
      }
    });

});

//Şebekede Kullanım Noktaları işlemini gerçekleştirmek için çağrı sonrası
app.post('/api/usePoints', function(req, res) {

  //İstekten alınacak değişkenleri bildir
  var accountNumber = req.body.accountnumber;
  var cardId = req.body.cardid;
  var partnerId = req.body.partnerid;
  var points = parseFloat(req.body.points);

  //Değişkenleri yazdır
  console.log('Using param - points: ' + points + ' partnerId: ' + partnerId + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);

  //Puan alanını doğrula
  validate.validatePoints(points)
    //Cevapta hata varsa hata döndür
    .then((checkPoints) => {
      if (checkPoints.error != null) {
        res.json({
          error: checkPoints.error
        });
        return;
      } else {
        points = checkPoints;
        //Ağdaki Puanları Kullan işlemini gerçekleştirme
        network.usePointsTransaction(cardId, accountNumber, partnerId, points)
          .then((response) => {
            //Cevapta hata varsa hata döndür
            if (response.error != null) {
              res.json({
                error: response.error
              });
            } else {
              //Aksi takdirde başarıyı geri getir
              res.json({
                success: response
              });
            }
          });
      }
    });


});

//Üye verilerini, işlem verilerini ve iş ortaklarıyla ağ üzerinden işlem yapmak için çağrı gönderme
app.post('/api/memberData', function(req, res) {

  //İstekten alınacak değişkenleri bildir
  var accountNumber = req.body.accountnumber;
  var cardId = req.body.cardid;

  //Değişkenleri yazdır
  console.log('memberData using param - ' + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);

  //Nesneyi bildir
  var returnData = {};

  //Ağdan üye verilerini al
  network.memberData(cardId, accountNumber)
    .then((member) => {
      //Cevapta hata varsa hata döndür
      if (member.error != null) {
        res.json({
          error: member.error
        });
      } else {
        //Nesne döndürmek için üye verilerini ekle
        returnData.accountNumber = member.accountNumber;
        returnData.firstName = member.firstName;
        returnData.lastName = member.lastName;
        returnData.phoneNumber = member.phoneNumber;
        returnData.email = member.email;
        returnData.points = member.points;
      }

    })
    .then(() => {
      //Ağdan Puan Kullanın işlemler olsun
      network.usePointsTransactionsInfo(cardId)
        .then((usePointsResults) => {
          //Cevapta hata varsa hata döndür
          if (usePointsResults.error != null) {
            res.json({
              error: usePointsResults.error
            });
          } else {
            //Nesne döndürmek için işlem verisi ekle
            returnData.usePointsResults = usePointsResults;
          }

        }).then(() => {
          //Ağdan Puan Kazanma işlemlerini alma
          network.earnPointsTransactionsInfo(cardId)
            .then((earnPointsResults) => {
              //Cevapta hata varsa hata döndür
              if (earnPointsResults.error != null) {
                res.json({
                  error: earnPointsResults.error
                });
              } else {
                //Nesne döndürmek için işlem verisi ekle
                returnData.earnPointsResult = earnPointsResults;
              }

            })
            .then(() => {
              //Ortakların ağdan işlem yapmasını sağlamak
              network.allPartnersInfo(cardId)
              .then((partnersInfo) => {
                //Cevapta hata varsa hata döndür
                if (partnersInfo.error != null) {
                  res.json({
                    error: partnersInfo.error
                  });
                } else {
                  //Nesne döndürmek için iş ortağı verileri ekleyin
                  returnData.partnersData = partnersInfo;
                }

                res.json(returnData);

              });
            });
        });
    });

});

//İş ortağı verilerini ve işlem verilerini şebekeden almak için çağrı gönder
app.post('/api/partnerData', function(req, res) {

  //İstekten alınacak değişkenleri bildir
  var partnerId = req.body.partnerid;
  var cardId = req.body.cardid;

  //Değişkenleri yazdır
  console.log('partnerData using param - ' + ' partnerId: ' + partnerId + ' cardId: ' + cardId);

  //Nesneyi bildir
  var returnData = {};

  //Ağdan ortak verileri almak
  network.partnerData(cardId, partnerId)
    .then((partner) => {
      //Cevapta hata varsa hata döndür
      if (partner.error != null) {
        res.json({
          error: partner.error
        });
      } else {
        //Nesneyi döndürmek için iş ortağı verileri ekleyin
        returnData.id = partner.id;
        returnData.name = partner.name;
      }

    })
    .then(() => {
      //Ağdan Puan işlemlerini kullanma
      network.usePointsTransactionsInfo(cardId)
        .then((usePointsResults) => {
          //Cevapta hata varsa hata döndür
          if (usePointsResults.error != null) {
            res.json({
              error: usePointsResults.error
            });
          } else {
            //Nesne döndürmek için işlem verisi ekle
            returnData.usePointsResults = usePointsResults;
            //Eş tarafından iade edilen nesne tarafından toplanan toplam puan
            returnData.pointsCollected = analysis.totalPointsCollected(usePointsResults);
          }

        })
        .then(() => {
          //Ağdan Puan kazanın
          network.earnPointsTransactionsInfo(cardId)
            .then((earnPointsResults) => {
              //Cevapta hata varsa hata döndür
              if (earnPointsResults.error != null) {
                res.json({
                  error: earnPointsResults.error
                });
              } else {
                //Nesne döndürmek için işlem verileri
                returnData.earnPointsResults = earnPointsResults;
                returnData.pointsGiven = analysis.totalPointsGiven(earnPointsResults);
              }

              res.json(returnData);

            });
        });
    });

});

var port = process.env.PORT || 8000;
if (process.env.VCAP_APPLICATION) {
  port = process.env.PORT;
}

app.listen(port, function() {
  console.log('app running on port: %d', port);
});
