const expect = require('expect');
const rewire = require('rewire');

var app = rewire('./app');

describe('App', () => {
  var db = {
    saveUser: expect.createSpy()
  };
  app.__set__('db', db);

  it('should call the spy correctly', () => {
    var spy = expect.createSpy();
    spy('Krzysztof', 22);
    expect(spy).toHaveBeenCalledWith('Krzysztof', 22);
  });

  it('should call saveUser with user object', () => {
    var email = 'krzysztof@example.com';
    var password = 'qwerty12';

    app.handleSignup(email, password);
    expect(db.saveUser).toHaveBeenCalledWith({email, password});
  });

});
