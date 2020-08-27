const playTypes = {
  TRAGEDY: 'tragedy',
  COMEDY: 'comedy'
};

function currencyFormat() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
}

function calAmount(playType, perf) {
  let thisAmount = 0;
  switch (playType) {
    case playTypes.TRAGEDY:
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      return thisAmount;
    case playTypes.COMEDY:
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      return thisAmount;
    default:
      throw new Error(`unknown type: ${playType}`);
  }
}

function addVolumeCredits(volumeCredits, audience, playType) {
  let resultCredits = volumeCredits + Math.max(audience - 30, 0);
  if (playTypes.COMEDY === playType) {
    resultCredits += Math.floor(audience / 5);
  }
  return resultCredits;
}

function statement (invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;

  let result = `Statement for ${invoice.customer}\n`;

  const format = currencyFormat();

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    const thisAmount = calAmount(play.type, perf);
    volumeCredits = addVolumeCredits(volumeCredits, perf.audience, play.type);
    //print line for this order
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}

module.exports = {
  statement,
};
