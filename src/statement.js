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
  let statementData = {
    totalAmount: 0,
    volumeCredits: 0
  };
  statementData.performances = invoice.performances.map(performance => {
    const play = plays[performance.playID];
    const amount = calAmount(play.type, performance);
    statementData.volumeCredits = addVolumeCredits(statementData.volumeCredits, performance.audience, play.type);
    statementData.totalAmount += amount;
    return {
      name: play.name,
      type: play.type,
      amount: amount,
      audience: performance.audience
    }
  });
  return statementData;
}

function generateHtml(customer, statementData) {
  let result = `<h1>Statement for ${customer}</h1>\n`;
  if (statementData.performances.length > 0) {
    result += `<table>\n<tr><th>play</th><th>seats</th><th>cost</th></tr>`;
    statementData.performances.forEach(item => {
      result += ` <tr><td>${item.name}</td><td>${item.audience}</td><td>${currencyFormat(item.amount)}</td></tr>\n`;
    })
    result += `</table>\n`
  }
  result += `<p>Amount owed is <em>${currencyFormat(statementData.totalAmount)}</em></p>\n`;
  result += `<p>You earned <em>${statementData.volumeCredits}</em> credits</p>\n`;
  return result;
}

function statement (invoice, plays) {
  const statementData = createStatementData(invoice, plays);
  return generateHtml(invoice.customer, statementData);
}

module.exports = {
  statement,
};
