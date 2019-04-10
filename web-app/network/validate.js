module.exports = {

  /*
  * Validata member registration fields ensuring the fields meet the criteria
  * @param {String} cardId
  * @param {String} accountNumber
  * @param {String} firstName
  * @param {String} lastName
  * @param {String} phoneNumber
  * @param {String} email
  */
  validateMemberRegistration: async function(cardId, accountNumber, firstName, lastName, email, phoneNumber) {

    var response = {};

    //verify input otherwise return error with an informative message
    if (accountNumber.length < 6) {
      response.error = "Hesap numarası en az altı haneli olmalıdır";
      console.log(response.error);
      return response;
    } else if (!isInt(accountNumber)) {
      response.error = "Hesap numarası sadece rakamlardan oluşmalıdır";
      console.log(response.error);
      return response;
    } else if (accountNumber.length > 25) {
      response.error = "Hesap numarası 25 haneden az olmalıdır";
      console.log(response.error);
      return response;
    } else if (cardId.length < 1) {
      response.error = "Erişim anahtarını giriniz"; 
      console.log(response.error);
      return response;
    } else if (!/^[0-9a-zA-Z]+$/.test(cardId)) {
      response.error = "Kart kimliği yalnızca harf ve rakam olabilir";
      console.log(response.error);
      return response;
    } else if (firstName.length < 1) {
      response.error = "Ad giriniz";
      console.log(response.error);
      return response;
    } else if (!/^[a-zA-Z]+$/.test(firstName)) {
      response.error = "Ad alanı sadece harflerden oluşmalıdır";
      console.log(response.error);
      return response;
    } else if (lastName.length < 1) {
      response.error = "Soyad giriniz";
      console.log(response.error);
      return response;
    } else if (!/^[a-zA-Z]+$/.test(lastName)) {
      response.error = "Soyad alanı sadece harflerden oluşmalıdır";
      console.log(response.error);
      return response;
    } else if (email.length < 1) {
      response.error = "Mail giriniz";
      console.log(response.error);
      return response;
    } else if (!validateEmail(email)) {
      response.error = "Geçerli bir mail giriniz";
      console.log(response.error);
      return response;
    } else if (phoneNumber.length < 1) {
      response.error = "Telefon numarasını giriniz";
      console.log(response.error);
      return response;
    } else if (!validatePhoneNumber(phoneNumber)) {
      response.error = "Geçerli bir telefon numarası giriniz";
      console.log(response.error);
      return response;
    } else {
      console.log("Girişler Geçerli");
      return response;
    }

  },

  /*
  * Validata partner registration fields ensuring the fields meet the criteria
  * @param {String} cardId
  * @param {String} partnerId
  * @param {String} name
  */
  validatePartnerRegistration: async function(cardId, partnerId, name) {

    var response = {};

    //verify input otherwise return error with an informative message
    if (cardId.length < 1) {
      response.error = "Erişim anahtarını giriniz";
      console.log(response.error);
      return response;
    } else if (!/^[0-9a-zA-Z]+$/.test(cardId)) {
      response.error = "Erişim anahtarı yalnızca harf ve rakam olabilir";
      console.log(response.error);
      return response;
    } else if (partnerId.length < 1) {
      response.error = "Şirket kimliğini giriniz";
      console.log(response.error);
      return response;
    } else if (!/^[0-9a-zA-Z]+$/.test(partnerId)) {
      response.error = "Şirket kimliği yalnızca harf ve rakam olabilir";
      console.log(response.error);
      return response;
    } else if (name.length < 1) {
      response.error = "Şirket adını giriniz";
      console.log(response.error);
      return response;
    } else if (!/^[a-zA-Z]+$/.test(name)) {
      response.error = "Şirket ismi sadece harf olmalıdır";
      console.log(response.error);
      return response;
    } else {
      console.log("Girişler Geçerli");
      return response;
    }

  },

  validatePoints: async function(points) {

    //verify input otherwise return error with an informative message
    if (isNaN(points)) {
      response.error = "Puanlar sayı olmalıdır";
      console.log(response.error);
      return response;
    } else {
      return Math.round(points);
    }

  }

}


//stackoverflow
function isInt(value) {
  return !isNaN(value) && (function(x) {
    return (x | 0) === x;
  })(parseFloat(value))
}

//stackoverflow
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

//stackoverflow
function validatePhoneNumber(phoneNumber) {
  var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(String(phoneNumber));
}
