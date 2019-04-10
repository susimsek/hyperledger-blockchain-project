module.exports = {

  /*
   * Toplam puanları hesapla
   */
  totalPointsCollected: function(usePointsTransactions) {
    //İşlemler arasında geçiş yapar ve tüm noktaları ekler
    var totalPointsCollected = 0;
    for (var i = 0; i < usePointsTransactions.length; i++) {
      totalPointsCollected = totalPointsCollected + usePointsTransactions[i].points;
    }
    return totalPointsCollected;
  },

 
  totalPointsGiven: function(earnPointsTransactions) {
    //İşlemler arasında geçiş yapın ve tüm noktaları ekleyin
    var totalPointsGiven = 0;
    for (var i = 0; i < earnPointsTransactions.length; i++) {
      totalPointsGiven = totalPointsGiven + earnPointsTransactions[i].points;
    }
    return totalPointsGiven;
  }

}
