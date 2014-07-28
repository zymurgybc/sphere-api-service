'use strict';

var express = require('express');
var router = express.Router();
var auth = require('../../passport');

var restUtils = require('../utils');

router.get('/things', auth.requireUser({api: true}), function(req, res) {
  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.listItems',
      req.user, 'thing'
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

router.get('/things/:thingId', auth.requireUser({api: true}), function(req, res) {
  var response = req.app.get('service').facet('modelStoreService').then(function(modelStoreService) {
    return modelStoreService.call(
      'modelstore.getItem',
      req.user, 'thing', req.params.thingId
    ).timeout(25000);
  });

  restUtils.standardResponse(res, response);
});

module.exports = router;