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
    t.is(actualResult, `Statement for BigCo\n` +
        `Amount owed is $0.00\n` +
        `You earned 0 credits \n`);
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
    t.is(actualResult, `Statement for BigCo\n` +
        ` Hamlet: $400.00 (30 seats)\n` +
        `Amount owed is $400.00\n` +
        `You earned 0 credits \n`);
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
    t.is(actualResult, `Statement for BigCo\n` +
        ` Hamlet: $410.00 (31 seats)\n` +
        `Amount owed is $410.00\n` +
        `You earned 1 credits \n`);
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
    t.is(actualResult, `Statement for BigCo\n` +
        ` As You Like It: $360.00 (20 seats)\n` +
        `Amount owed is $360.00\n` +
        `You earned 4 credits \n`);
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
    t.is(actualResult, `Statement for BigCo\n` +
        ` As You Like It: $468.00 (21 seats)\n` +
        `Amount owed is $468.00\n` +
        `You earned 4 credits \n`);
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
    t.is(actualResult, `Statement for BigCo\n` +
        ` Hamlet: $650.00 (55 seats)\n` +
        ` As You Like It: $580.00 (35 seats)\n` +
        ` Othello: $500.00 (40 seats)\n` +
        `Amount owed is $1,730.00\n` +
        `You earned 47 credits \n`);
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
