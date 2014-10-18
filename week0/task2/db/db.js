var debug = require('debug')('db');
var dbUtils = require("./db-utils");
var _ = require('underscore');

// ... and only for the deep clone
var lodash = require('lodash');

var db = [];

module.exports = {
  
  reinit: reinit,
  
  insertUser: insertUser,
  isUserExists: isUserExists,
  
  findUser: findUser,
  findUserById: findUserById,  
  findAllUsers: findAllUsers,
  findUserChirps: findUserChirps,  
  
  insertChirp: insertChirp,
  findChirpById: findChirpById,
  findAllChirps: findAllChirps,
  deleteChirp: deleteChirp
  
}

function reinit(data) {
  db = lodash.cloneDeep(data);
}

function insertUser(user) {

  if (isUserNameExists(user.user)) {
    debug('dsadasdsa')
    throw new Error('User name exist!');
  }
  debug('create')
  user.userId = dbUtils.uid();
  user.chirps = [];
  db.push(user);
  
  debug('db content after user insert: ');
  debug(db);  
  
  return user.userId;
}

function insertChirp(userId, chirpText) {
  var user = findUserById(userId);
  
  if (user === undefined) {
    throw new Error('User does not exist!');
  }
  
  var chirpId = dbUtils.uid();

  user.chirps.push({
    chirpId: chirpId,
    chirpText: chirpText,
    chirpTime: dbUtils.date()
  })

  debug('user chirps after chirp insert: ');
  debug(user.chirps);  
  
  return chirpId;
}

function deleteChirp(userId, chirpId) {
  function removeUser() {
    var removedUser;
    
    db = _.filter(db, function (user) {
      if (user.userId === userId) {
        removedUser = user
      }
      return user.userId !== userId;
    });
  
    if (removedUser === undefined) {
      throw new Error('User does not exist!');
    }
    
    return removedUser;
  }
  
  function updateChirps(chirps) {
    var removedChirp;
    
    var updatedChirps = _.filter(chirps, function (chirp) {
      if (chirp.chirpId === chirpId) {
        removedChirp = chirp;
      }
      return chirp.chirpId !== chirpId;
    });
    
    if (removedChirp === undefined) {
      throw new Error('Chirp with such id does not exist!');
    }
    return updatedChirps;
  }
  
  var userForUpdate = removeUser();
  
  debug("Chirps before deletion: ");
  debug(userForUpdate.chirps);
  
  userForUpdate.chirps = updateChirps(userForUpdate.chirps);
  
  debug("Chirps after deletion: ");  
  debug(userForUpdate.chirps);  
  
  db.push(userForUpdate);
}


function findUser(user, userId) {
  return _.findWhere(db, {"user": user, "userId": userId})
}

function findUserById(userId) {
  return _.findWhere(db, {"userId": userId})  
}

function findUserByName(user) {
  return _.findWhere(db, {"user": user})  
}

function isUserExists(user, userId) {
  return findUser(user, userId) ? true : false
}

function isUserNameExists(user) {
  return findUserByName(user) ? true : false
}


function findAllChirps() {
  return _.flatten(_.map(db, function (user) {
    var userId = user.userId;
    if (!_.isEmpty(user.chirps)) {  
      return _.reduce(user.chirps, function (previous, chirp) {
        return previous.concat({"userId": userId, "chirpId": chirp.chirpId, "chirpText": chirp.chirpText, "chirpTime": chirp.chirpTime})
      }, [])
    } else {
      return [];
    }
  }))
}

function findAllUsers() {
  return _.map(db, function (user) {
    return {"user": user.user, "userId": user.userId, "chirps": user.chirps.length}
  })
}

function findUserChirps(user, userId) {
  return findUser(user, userId).chirps
}

function findChirpById(chirpId) {
  var chirps = findAllChirps();
  return _.where(chirps, {chirpId: chirpId});
}




