'use strict';

exports.testPony = function (test) {
  test.expect(2);
  if (false) {
    test.ok(false, 'This should not have passed');
  }
  test.ok(true, 'This is not a pony');
  test.done();
};