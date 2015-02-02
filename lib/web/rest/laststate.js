'use strict';
var when = require('when');
var debug = require('debug')('api:laststate');


// this function retrieves cached data from redis
exports.getCachedLastState = function (redis, user, results) {
  return when.map(results, function (thing) {

    debug('thing', thing);

    if (!thing || !thing.device || !thing.device.channels) {
      return thing;
    }

    // iterate over the channels and retrieve the last state
    return when.map(thing.device.channels, function (channel) {
      var stateKey = 'state:' + user.id + ':' + thing.device.id + ':' + channel.id;
      return redis.client.get(stateKey).then(function (value) {
        var payload = JSON.parse(value);
        if (!payload || !payload.params[0])return channel;
        debug('state', stateKey, 'data', payload);
        channel.lastState = {timestamp: payload.time, payload: payload.params[0]};
        return channel;
      });
    }).then(function(channels){
      if (channels) thing.channels = channels;
      return thing
    });
  });
};