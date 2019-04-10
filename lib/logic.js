'use strict';

/* global getParticipantRegistry emit */


/**
 * Puan kazanma işlemi
 * @param {org.clp.biznet.EarnPoints} earnPoints
 * @transaction
 */
async function EarnPoints(earnPoints) {

  //Üye puanlarını güncelleme
  earnPoints.member.points = earnPoints.member.points + earnPoints.points;

  //Üye güncelle
  const memberRegistry = await getParticipantRegistry('org.clp.biznet.Member');
  await memberRegistry.update(earnPoints.member);

  //Ağda ortak olup olmadığını kontrol edin
  const partnerRegistry = await getParticipantRegistry('org.clp.biznet.Partner');
  partnerExists = await partnerRegistry.exists(earnPoints.partner.id);
  if (partnerExists == false) {
    throw new Error('Şirket yok - Şirket kimliğini kontrol et');
  }

}


/**
 * Puan işlemini kullanma
 * @param {org.clp.biznet.UsePoints} usePoints
 * @transaction
 */
async function UsePoints(usePoints) {

  //Üyenin yeterli puan olup olmadığını kontrol edinme
  if (usePoints.member.points < usePoints.points) {
    throw new Error('Yetersiz puan');
  }

  //Üye noktalarını güncelleme
  usePoints.member.points = usePoints.member.points - usePoints.points

  //Üye güncelle
  const memberRegistry = await getParticipantRegistry('org.clp.biznet.Member');
  await memberRegistry.update(usePoints.member);

  //Ağda ortak olup olmadığını kontrol edin
  const partnerRegistry = await getParticipantRegistry('org.clp.biznet.Partner');
  partnerExists = await partnerRegistry.exists(usePoints.partner.id);
  if (partnerExists == false) {
    throw new Error('Şirket yok - kimliği kontrol et');
  }
}
