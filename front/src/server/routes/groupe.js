const express = require('express');
const router = express.Router();
const status = require('http-status');
const mongoose = require('mongoose');
const passport = require('passport');
const Groupe = require('../models/groupes');

/* POST: save a new groupe */
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  var data = req.body;
  // create a new groupe
  var newgroupe = new Groupe();
  newgroupe.groupename = data.groupename;
  var permission = [];
  for (var perms in data) { // Looping through permissions
    if (perms !== 'groupename') {
      if (Object.keys(data[perms]).length) {
        permission.push(perms);
      }
      for (var perm in data[perms]) { //looping through permissions permission
        permission.push(data[perms][perm]);
      }
    }
  }
  newgroupe.permissions = permission;
  // save the groupe
  newgroupe.save(function (err, Groupe) {
    if (err) {
      res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
    } else {
      res.json({ success: true, msg: "Groupe créé avec succès" });
    }
  });
});


router.put('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var data = req.body;
  console.log(data);
  var permission = [];
  for (var perms in data) { // Looping through permissions
    if (perms !== 'groupename') {
      if (Object.entries(data[perms]).length) {
        permission.push(perms);
      }
      for (var perm in data[perms]) { //looping through permissions permission
        permission.push(data[perms][perm]);
      }
    }
  }
  permissionf = permission.filter(function (elem, pos) {
    return permission.indexOf(elem) == pos;
  })

  Groupe.findByIdAndUpdate(req.params.id, {
    $set:
    {
      groupename: data.groupename,
      permissions: permissionf
    }
  }, function (err, post) {
    if (err) {
      res.json({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message });
    } else {
      res.json({ success: true, msg: "Mise à jour avec succès" });
    }
  });
  permission = [''];
});

router.get('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  Groupe.find().sort('-updatedAt').exec(function (err, groupes) {
    if (err) return next(err);
    res.json(groupes);
  });
});




router.get('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  Groupe.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  Groupe.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


router.get('/getgroupes/:GroupeIds', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var ids = req.params.GroupeIds.toString().split(",");
  Groupe.find({ "_id": { $in: ids } }).sort('-updatedAt').exec(function (err, groupes) {
    if (err) return next(err);
    res.json(groupes);
  });
});
//Delete
router.put('/delete/:groupId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  const groupId = req.params.groupId;
  const active = req.body.active;
  Groupe.update({ "_id": groupId }, { "active": active }, function (err, groupe) {
    if (err) {
      console.log(err);
      res.json({ success: false, msg: "Error" });
    } else {
      res.json({ success: true, msg: "Deleted groupe successfully", obj: groupe });
    }
  })
});

module.exports = router;