const sanitizer = require('../../../sanitizer/_synthesize_analysis');
const _ = require('lodash');

module.exports.tests = {};

module.exports.tests.text_parser = function(test, common) {
  test('all variables should be parsed', function(t) {
    const raw = {
      query: ' \t query \t value \t ',
      address: ' \t address \t value \t ',
      neighbourhood: ' \t neighbourhood \t value \t ',
      borough: ' \t borough \t value \t ',
      locality: ' \t locality \t value \t ',
      county: ' \t county \t value \t ',
      region: ' \t region \t value \t ',
      postalcode: ' \t postalcode \t value \t ',
      country: ' \t country \t value \t '
    };

    const clean = {};

    const expected_clean = {
      parsed_text: {
        address: 'address value',
        neighbourhood: 'neighbourhood value',
        borough: 'borough value',
        city: 'locality value',
        county: 'county value',
        state: 'region value',
        postalcode: 'postalcode value',
        country: 'country value'
      }
    };

    const messages = sanitizer(raw, clean);

    t.deepEquals(clean, expected_clean);
    t.deepEquals(messages.errors, [], 'no errors');
    t.deepEquals(messages.warnings, [], 'no warnings');
    t.end();

  });

  test('non-string and blank string values should be treated as not supplied', function(t) {
    // helper to return a random value that's considered invalid
    function getInvalidValue() {
      return _.sample([{}, [], false, '', ' \t ', 17, undefined]);
    }

    const raw = {
      address: getInvalidValue(),
      neighbourhood: getInvalidValue(),
      borough: getInvalidValue(),
      locality: getInvalidValue(),
      county: getInvalidValue(),
      region: getInvalidValue(),
      postalcode: getInvalidValue(),
      country: getInvalidValue()
    };

    const clean = {};

    const expected_clean = {
      parsed_text: {}
    };

    const messages = sanitizer(raw, clean);

    t.deepEquals(clean, expected_clean);
    t.deepEquals(messages.errors, ['at least one of the following fields is required: ' +
      'address, neighbourhood, borough, locality, county, region, postalcode, country'], 'no errors');
    t.deepEquals(messages.warnings, [], 'no warnings');
    t.end();

  });

  test('no supplied fields should return error', function(t) {
    const raw = {};

    const clean = {};

    const expected_clean = { parsed_text: {} };

    const messages = sanitizer(raw, clean);

    t.deepEquals(clean, expected_clean);
    t.deepEquals(messages.errors, ['at least one of the following fields is required: ' +
      'address, neighbourhood, borough, locality, county, region, postalcode, country'], 'no errors');
    t.deepEquals(messages.warnings, [], 'no warnings');
    t.end();

  });

  test('postalcode-only parsed_text should return error', function(t) {
    const raw = {
      postalcode: 'postalcode value'
    };

    const clean = {};

    const expected_clean = {
      parsed_text: {
        postalcode: 'postalcode value'
      }
    };

    const messages = sanitizer(raw, clean);

    t.deepEquals(clean, expected_clean);
    t.deepEquals(messages.errors, ['postalcode-only inputs are not supported'], 'no errors');
    t.deepEquals(messages.warnings, [], 'no warnings');
    t.end();

  });

};

module.exports.all = function (tape, common) {
  function test(name, testFunction) {
    return tape('sanitizer _synthesize_analysis: ' + name, testFunction);
  }

  for( const testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
