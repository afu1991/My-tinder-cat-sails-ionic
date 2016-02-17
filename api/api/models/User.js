/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
 var bcrypt = require('bcrypt');

module.exports = {

    types: {

        password: function(password) {
            return password === this.passwordconfirm;
        }
    },
  attributes: {

    username: {
      type: 'string',
      unique: true,
      required:true
    },
    password: {
      required:true,
      password: true
    },
    passwordconfirm: {
       type: 'string'
    },
    age: {
      type: 'INTEGER',
      max: 99,
      required:true
    },
    lastname: {
        type: 'string'
    },
    firstname: {
        type: 'string'
    },
    image: {
        type: 'string'
    },
    sexe: {
        type: 'string',
        required:true
    },
    liked:{
      collection: 'like',
      via: 'owner'
    },
    being_liked: {
        collection: 'like',
        via: 'target'
    },
    disliked:{
        collection: 'dislike',
        via: 'owner'
    },
    being_disliked: {
        collection: 'dislike',
        via: 'target'
    }
  },
  beforeCreate: function(user, cb) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    user.password = hash;
                    user.passwordconfirm = hash;
                    cb();
                }
            });
        });
    }
  //    beforeDestroy: function(criteria, cb) {
  //   // Destroy any user associated to a deleted pet
  //   User.find(criteria).populate('liked').exec(function (err, pets){
  //     if (err) return cb(err);
  //     console.log(pets);
  //     // pets.forEach(function(recordToDestroy) {563fcfa58d4184b02b314122
  //     //   User.destroy({id: _.pluck(recordToDestroy.owners, 'id')}).exec(function(err) {
  //     //     console.log('The users associated to the pet ' + recordToDestroy.name + ' have been deleted');
  //     //   });
  //     // });
  //     cb();
  //   })
  // }
};
