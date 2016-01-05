'use strict';

let redis = require('redis');
let bcrypt = require('bcrypt');
let db = redis.createClient();

class User {

  constructor(obj) {
    for (var key in obj) {
      this[key] = obj[key];
    }
  }

  save(fn) {
    if (this.id) {
      this.update(fn);
    } else {
      db.incr('user:ids', (err, id) => {
        if (err) return fn(err);
        this.id = id;
        this.hashPassword(err => {
          if (err) return fn(err);
          this.update(fn);
        });
      });
    }
  }

  update(fn) {
    let id = this.id;
    db.set('user:id:' + this.name, id, (err) => {
      if (err) return fn(err);
      db.hmset('user:' + id, this, (err) => {
        fn(err);
      });
    });
  }

  hashPassword(fn) {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) return fn(err);
      bcrypt.hash(this.pass, salt, (err, hash) => {
        if (err) return fn(err);
        this.pass = hash;
        fn();
      })
    });
  }

  static getByName(name, fn) {
    User.getId(name, (err, id) => {
      if (err) return fn(err);
      User.get(id, fn);
    });
  }

  static getId(name, fn) {
    db.get('user:id:' + name, fn);
  }

  static get(id, fn) {
    db.hgetall('user:' + id, (err, user) => {
      if (err) return fn(err);
      fn(null, new User(user));
    });
  }

  static authenticate(name, pass, fn) {
    User.getByName(name, (err, user) => {
      if (err) return fn(err);
      if (!user) return fn(); // not found
      bcrypt.hash(pass, user.salt, (err, hash) => {
        if (err) return fn(err);
        if (hash == user.pass) return fn(null, user); // found
        fn(); // invalid password
      });
    });
  }
}

module.exports = User;
