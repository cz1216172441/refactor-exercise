const playTypes = {
  TRAGEDY: 'tragedy',
  COMEDY: 'comedy'
};

function currencyFormat(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount / 100);
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

function createStatementData(invoice, plays) {
  return invoice.performances.map(performance => {
    const play = plays[performance.playID];
    const amount = calAmount(play.type, performance);
    return {
      name: play.name,
      type: play.type,
      amount: amount,
      audience: performance.audience
    }
  })
}

function statement (invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;

  let result = `Statement for ${invoice.customer}\n`;
  const statementData = createStatementData(invoice, plays);

  statementData.forEach(item => {
    volumeCredits = addVolumeCredits(volumeCredits, item.audience, item.type);
    result += ` ${item.name}: ${currencyFormat(item.amount)} (${item.audience} seats)\n`;
    totalAmount += item.amount;
  })

  result += `Amount owed is ${currencyFormat(totalAmount)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}

module.exports = {
  statement,
};
