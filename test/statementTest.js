const test = require('ava');
const {statement} = require('../src/statement');

const plays = {
    'hamlet': {
        'name': 'Hamlet',
        'type': 'tragedy',
    },
    'as-like': {
        'name': 'As You Like It',
        'type': 'comedy',
    },
    'othello': {
        'name': 'Othello',
        'type': 'tragedy',
    },
};

test('should_return_amount_0_and_credits_0_when_statement_given_0_performance', t => {
    //given
    const invoice = {
        'customer': 'BigCo',
        'performances': []
    }

    // when
    const actualResult = statement(invoice, plays);

    // then
    t.is(actualResult, '<h1>Statement for BigCo</h1>\n' +
        '<p>Amount owed is <em>$0.00</em></p>\n' +
        '<p>You earned <em>0</em> credits</p>\n');
});

test('should_return_amount_400_and_credits_0_when_statement_given_1_performance_with_type_tragedy_and_audience_30', t => {
    //given
    const invoice = {
        'customer': 'BigCo',
        'performances': [{
            'playID': 'hamlet',
            'audience': 30
        }]
    }

    // when
    const actualResult = statement(invoice, plays);

    // then
    t.is(actualResult, `<h1>Statement for BigCo</h1>\n` +
        `<table>\n` +
        `<tr><th>play</th><th>seats</th><th>cost</th></tr>` +
        ` <tr><td>Hamlet</td><td>30</td><td>$400.00</td></tr>\n` +
        '</table>\n' +
        `<p>Amount owed is <em>$400.00</em></p>\n` +
        `<p>You earned <em>0</em> credits</p>\n`);
});

test('should_return_amount_410_and_credits_1_when_statement_given_1_performance_with_type_tragedy_and_audience_31', t => {
    //given
    const invoice = {
        'customer': 'BigCo',
        'performances': [{
            'playID': 'hamlet',
            'audience': 31
        }]
    }

    // when
    const actualResult = statement(invoice, plays);

    // then
    t.is(actualResult, `<h1>Statement for BigCo</h1>\n` +
        `<table>\n` +
        `<tr><th>play</th><th>seats</th><th>cost</th></tr>` +
        ` <tr><td>Hamlet</td><td>31</td><td>$410.00</td></tr>\n` +
        '</table>\n' +
        `<p>Amount owed is <em>$410.00</em></p>\n` +
        `<p>You earned <em>1</em> credits</p>\n`);
});

test('should_return_amount_360_and_credits_4_when_statement_given_1_performance_with_type_comedy_and_audience_20', t => {
    //given
    const invoice = {
        'customer': 'BigCo',
        'performances': [{
            'playID': 'as-like',
            'audience': 20
        }]
    }

    // when
    const actualResult = statement(invoice, plays);

    // then
    t.is(actualResult, `<h1>Statement for BigCo</h1>\n` +
        `<table>\n` +
        `<tr><th>play</th><th>seats</th><th>cost</th></tr>` +
        ` <tr><td>As You Like It</td><td>20</td><td>$360.00</td></tr>\n` +
        '</table>\n' +
        `<p>Amount owed is <em>$360.00</em></p>\n` +
        `<p>You earned <em>4</em> credits</p>\n`);
});

test('should_return_amount_468_and_credits_4_when_statement_given_1_performance_with_type_comedy_and_audience_21', t => {
    //given
    const invoice = {
        'customer': 'BigCo',
        'performances': [{
            'playID': 'as-like',
            'audience': 21
        }]
    }

    // when
    const actualResult = statement(invoice, plays);

    // then
    t.is(actualResult, `<h1>Statement for BigCo</h1>\n` +
        `<table>\n` +
        `<tr><th>play</th><th>seats</th><th>cost</th></tr>` +
        ` <tr><td>As You Like It</td><td>21</td><td>$468.00</td></tr>\n` +
        '</table>\n' +
        `<p>Amount owed is <em>$468.00</em></p>\n` +
        `<p>You earned <em>4</em> credits</p>\n`);
});

test('should_return_amount_1730_and_credits_47_when_statement_given_3_performances', t => {
    //given
    const invoice = {
        'customer': 'BigCo',
        'performances': [
            {
                'playID': 'hamlet',
                'audience': 55,
            },
            {
                'playID': 'as-like',
                'audience': 35,
            },
            {
                'playID': 'othello',
                'audience': 40,
            },
        ],
    };

    // when
    const actualResult = statement(invoice, plays);

    // then
    t.is(actualResult, `<h1>Statement for BigCo</h1>\n` +
        `<table>\n` +
        `<tr><th>play</th><th>seats</th><th>cost</th></tr>` +
        ` <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>\n` +
        ` <tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>\n` +
        ` <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>\n` +
        '</table>\n' +
        `<p>Amount owed is <em>$1,730.00</em></p>\n` +
        `<p>You earned <em>47</em> credits</p>\n`);
});

test('should_return_unknown_type_when_statement_given_1_play_with_unknown_type', t => {
    //given
    const plays = {
        'othello': {
            'name': 'Othello',
            'type': 'unknown',
        }
    };
    const invoice = {
        'customer': 'BigCo',
        'performances': [{
            'playID': 'othello',
            'audience': 21
        }]
    }

    try {
        // when
        statement(invoice, plays);
        t.fail();
    } catch (e) {
        // then
        t.is(e.message, 'unknown type: unknown');
    }
});
