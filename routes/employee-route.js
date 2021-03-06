'use strict';

const debug = require('debug')('buildpro:employee-route');
const jsonParser = require('body-parser').json();
const Router = require('express').Router;
const createError = require('http-errors');

const User = require('../model/user.js');
const Employee = require('../model/employee.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const fs = require('fs');
const path = require('path');
const del = require('del');
const multer = require('multer');
const s3methods = require('../lib/s3-methods.js');
const dataDir = `${__dirname}/../data`;
const upload = multer({dest: dataDir});

const employeeRouter = module.exports = Router();

employeeRouter.post('/api/employee/:userid', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/employee/:userid');

  req.body.userID = req.params.userid;
  debug('--------------->', req.body);
  new Employee(req.body).save()
  .then( employee => {
    return res.json(employee);
  })
  .catch(next);
});

employeeRouter.get('/api/employee/:id', bearerAuth, jsonParser, function(req, res, next) {
  debug('GET: /api/employee/:id');
  Employee.findOne({userID:req.params.id})
  .then( employee => {
    res.json(employee);
  })
  .catch(next);
});

employeeRouter.get('/api/all/employee', bearerAuth, function(req, res, next) {
  debug('GET: /api/all/employee');


  Employee.find({})
  .then( employees => {
    res.json(employees);
    debug('res', employees);
  })
  .catch(next);
});

employeeRouter.put('/api/employee/:id', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/employee/:id');
  if(Object.keys(req.body).length === 0) return next(createError(400, 'Bad Request'));
  Employee.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then( employee => {
    res.json(employee);
  })
  .catch(next);
});
