var apiUrl = location.protocol + '//' + location.host + "/api/";

//Kullanıcı girişini kontrol et ve sunucuyu ara
$('.sign-in-partner').click(function() {

  //Kullanıcı girişi verilerini al
  var formPartnerId = $('.partner-id input').val();
  var formCardId = $('.card-id input').val();

  //Json verisi oluştur
  var inputData = '{' + '"partnerid" : "' + formPartnerId + '", ' + '"cardid" : "' + formCardId + '"}';
  console.log(inputData);

  //Ajax araması yap
  $.ajax({
    type: 'POST',
    url: apiUrl + 'partnerData',
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
          var str = '<h2><b> ' + data.name + ' </b></h2>';
          str = str + '<h2><b> ' + data.id + ' </b></h2>';

          return str;
        });

        //Kontrol panelini güncelle
        $('.dashboards').html(function() {
          var str = '';
          str = str + '<h5>Total points allocated to customers: ' + data.pointsGiven + ' </h5>';
          str = str + '<h5>Total points redeemed by customers: ' + data.pointsCollected + ' </h5>';
          return str;
        });

        //Puan kazanma işlemlerini güncelle
        $('.points-allocated-transactions').html(function() {
          var str = '';
          var transactionData = data.earnPointsResults;

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

        //Giriş bölümünü kaldır
        document.getElementById('loginSection').style.display = "none";
        //İşlem bölümünü görüntüle
        document.getElementById('transactionSection').style.display = "block";
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      //Hata durumunda yeniden yükle
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);

      location.reload();
    }
  });

});
