var apiUrl = location.protocol + '//' + location.host + "/api/";

//Kullanıcı girişini kontrol et ve sunucuyu ara
$('.sign-in-member').click(function() {
  updateMember();
});

function updateMember() {

  //Kullanıcı girişi verilerini al
  var formAccountNum = $('.account-number input').val();
  var formCardId = $('.card-id input').val();

  //Json verisi oluştur
  var inputData = '{' + '"accountnumber" : "' + formAccountNum + '", ' + '"cardid" : "' + formCardId + '"}';
  console.log(inputData)

  //Ajax araması yap
  $.ajax({
    type: 'POST',
    url: apiUrl + 'memberData',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //Ekran yükleme
      document.getElementById('loader').style.display = "block";
    },
    success: function(data) {

      //Yükleyiciyi kaldır
      document.getElementById('loader').style.display = "none";

      //Verinin hata olup olmadığını kontrol et
      if (data.error) {
        alert(data.error);
        return;
      } else {

        //Başlığı güncelle
        $('.heading').html(function() {
          var str = '<h2><b>' + data.firstName + ' ' + data.lastName + '</b></h2>';
          str = str + '<h2><b>' + data.accountNumber + '</b></h2>';
          str = str + '<h2><b>' + data.points + '</b></h2>';

          return str;
        });

        //Puan kazanma işlemi için ortaklar açılır listesini güncelleyin
        $('.earn-partner select').html(function() {
          var str = '<option value="" disabled="" selected="">select</option>';
          var partnersData = data.partnersData;
          for (var i = 0; i < partnersData.length; i++) {
            str = str + '<option partner-id=' + partnersData[i].id + '> ' + partnersData[i].name + '</option>';
          }
          return str;
        });

        //Kullanım noktaları işlemi için güncelleme ortakları açılır listesi
        $('.use-partner select').html(function() {
          var str = '<option value="" disabled="" selected="">select</option>';
          var partnersData = data.partnersData;
          for (var i = 0; i < partnersData.length; i++) {
            str = str + '<option partner-id=' + partnersData[i].id + '> ' + partnersData[i].name + '</option>';
          }
          return str;
        });

        //Puan kazanma işlemlerini güncelle
        $('.points-allocated-transactions').html(function() {
          var str = '';
          var transactionData = data.earnPointsResult;

          for (var i = 0; i < transactionData.length; i++) {
            str = str + '<p>timeStamp: ' + transactionData[i].timestamp + '<br />partner: ' + transactionData[i].partner + '<br />member: ' + transactionData[i].member + '<br />points: ' + transactionData[i].points + '<br />transactionName: ' + transactionData[i].$class + '<br />transactionID: ' + transactionData[i].transactionId + '</p><br>';
          }
          return str;
        });

        //Kullanım puanları işlemini güncelle
        $('.points-redeemed-transactions').html(function() {
          var str = '';

          var transactionData = data.usePointsResults;

          for (var i = 0; i < transactionData.length; i++) {
            str = str + '<p>timeStamp: ' + transactionData[i].timestamp + '<br />partner: ' + transactionData[i].partner + '<br />member: ' + transactionData[i].member + '<br />points: ' + transactionData[i].points + '<br />transactionName: ' + transactionData[i].$class + '<br />transactionID: ' + transactionData[i].transactionId + '</p><br>';
          }
          return str;
        });

        //Giriş bölümünü kaldır ve üye sayfasını görüntüle
        document.getElementById('loginSection').style.display = "none";
        document.getElementById('transactionSection').style.display = "block";
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      //Hata durumunda yeniden yükle
      alert("Hata: Tekrar Deneyiniz")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    },
    complete: function() {

    }
  });
}


$('.earn-points-30').click(function() {
  earnPoints(30);
});

$('.earn-points-80').click(function() {
  earnPoints(80);
});

$('.earn-points-200').click(function() {
  earnPoints(200);
});


//Kullanıcı girişini kontrol et ve sunucuyu ara
$('.earn-points-transaction').click(function() {

  var formPoints = $('.earnPoints input').val();
  earnPoints(formPoints);
});


function earnPoints(formPoints) {

  //Kullanıcı girişi verilerini al
  var formAccountNum = $('.account-number input').val();
  var formCardId = $('.card-id input').val();
  var formPartnerId = $('.earn-partner select').find(":selected").attr('partner-id');

  //Json verisi oluştur
  var inputData = '{' + '"accountnumber" : "' + formAccountNum + '", ' + '"cardid" : "' + formCardId + '", ' + '"points" : "' + formPoints + '", ' + '"partnerid" : "' + formPartnerId + '"}';
  console.log(inputData)

  //Ajax araması yap
  $.ajax({
    type: 'POST',
    url: apiUrl + 'earnPoints',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //Ekran yükleme
      document.getElementById('loader').style.display = "block";
      document.getElementById('infoSection').style.display = "none";
    },
    success: function(data) {

      document.getElementById('loader').style.display = "none";
      document.getElementById('infoSection').style.display = "block";

      //Verinin hata olup olmadığını kontrol et
      if (data.error) {
        alert(data.error);
        return;
      } else {
        //Üye sayfasını güncelle ve başarılı işlemi bildir
        updateMember();
        alert('İşlem Başarılı');
      }


    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    }
  });

}

$('.use-points-50').click(function() {
  usePoints(50);
});

$('.use-points-150').click(function() {
  usePoints(100);
});

$('.use-points-200').click(function() {
  usePoints(150);
});


//Kullanıcı girişini kontrol et ve sunucuyu ara
$('.use-points-transaction').click(function() {
  var formPoints = $('.usePoints input').val();
  usePoints(formPoints);
});


function usePoints(formPoints) {

  //Kullanıcı girişi verilerini al
  var formAccountNum = $('.account-number input').val();
  var formCardId = $('.card-id input').val();
  var formPartnerId = $('.use-partner select').find(":selected").attr('partner-id');

  //Json verisi oluştur
  var inputData = '{' + '"accountnumber" : "' + formAccountNum + '", ' + '"cardid" : "' + formCardId + '", ' + '"points" : "' + formPoints + '", ' + '"partnerid" : "' + formPartnerId + '"}';
  console.log(inputData)

  //Ajax araması yap
  $.ajax({
    type: 'POST',
    url: apiUrl + 'usePoints',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //Ekran yükleme
      document.getElementById('loader').style.display = "block";
      document.getElementById('infoSection').style.display = "none";
    },
    success: function(data) {

      document.getElementById('loader').style.display = "none";
      document.getElementById('infoSection').style.display = "block";

      //Verinin hata olup olmadığını kontrol et
      if (data.error) {
        alert(data.error);
        return;
      } else {
        //Üye sayfasını güncelle ve başarılı işlemi bildir
        updateMember();
        alert('İşlem Başarılı');
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    },
    complete: function() {}
  });

}
