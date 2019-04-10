var apiUrl = location.protocol + '//' + location.host + "/api/";

console.log("at register.js");

//Veri kümesi oluşturmak için kullanıcı girişi ve çağrı sunucusunu kontrol edin
$('.register-member').click(function() {

  //get user input data
  var formAccountNum = $('.account-number input').val();
  var formCardId = $('.card-id input').val();
  var formFirstName = $('.first-name input').val();
  var formLastName = $('.last-name input').val();
  var formEmail = $('.email input').val();
  var formPhoneNumber = $('.phone-number input').val();

  //Json verisi oluştur
  var inputData = '{' + '"firstname" : "' + formFirstName + '", ' + '"lastname" : "' + formLastName + '", ' + '"email" : "' + formEmail + '", ' + '"phonenumber" : "' + formPhoneNumber + '", ' + '"accountnumber" : "' + formAccountNum + '", ' + '"cardid" : "' + formCardId + '"}';
  console.log(inputData)

  //Veri setini eklemek için ajax çağrısı yap
  $.ajax({
    type: 'POST',
    url: apiUrl + 'registerMember',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //Ekran yükleme
      document.getElementById('registration').style.display = "none";
      document.getElementById('loader').style.display = "block";
    },
    success: function(data) {

      //Yükleyiciyi kaldır
      document.getElementById('loader').style.display = "none";

      //Verinin hata olup olmadığını kontrol et
      if (data.error) {
        document.getElementById('registration').style.display = "block";
        alert(data.error);
        return;
      } else {
        //Başarılı kayıt bildir
        document.getElementById('successful-registration').style.display = "block";
        document.getElementById('registration-info').style.display = "none";
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      //Hata durumunda yeniden yükle
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    }
  });

});


//Veri kümesi oluşturmak için kullanıcı girişi ve çağrı sunucusunu kontrol edin
$('.register-partner').click(function() {

  //Kullanıcı girişi verilerini al
  var formName = $('.name input').val();
  var formPartnerId = $('.partner-id input').val();
  var formCardId = $('.card-id input').val();

  //Json verisi oluştur
  var inputData = '{' + '"name" : "' + formName + '", ' + '"partnerid" : "' + formPartnerId + '", ' + '"cardid" : "' + formCardId + '"}';
  console.log(inputData)

  //Veri setini eklemek için ajax çağrısı yap
  $.ajax({
    type: 'POST',
    url: apiUrl + 'registerPartner',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //Ekran yükleme
      document.getElementById('registration').style.display = "none";
      document.getElementById('loader').style.display = "block";
    },
    success: function(data) {

      //Yükleyiciyi kaldır
      document.getElementById('loader').style.display = "none";

      //Verinin hata olup olmadığını kontrol et
      if (data.error) {
        document.getElementById('registration').style.display = "block";
        alert(data.error);
        return;
      } else {
        //Başarılı kayıt bildir
        document.getElementById('successful-registration').style.display = "block";
        document.getElementById('registration-info').style.display = "none";
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      //Hata durumunda yeniden yükle
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    }
  });

});
