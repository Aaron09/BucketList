"use strict"

const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const mongoDB = require("./database/database.js") 
const DatabaseConstants = require("./database/constants.js")

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/assets/templates/welcome.html")
});

router.get("/bucket", (req, res) => {
  
  var bucketID = req.query.id;
  if (bucketID == undefined) {
    res.sendFile(__dirname + "/assets/templates/404.html");
    return;
  }
  
  var bucketsCollection = mongoDB.collection(DatabaseConstants.BUCKETS_COLLECTION_NAME);
  
  bucketsCollection.findOne({ bucketID: bucketID }, (err, bucket) => {
    if (err) {
      res.sendFile(__dirname + "/assets/templates/404.html");
      return;
    }

    console.log(bucket.bucketID);
  });

  res.sendFile(__dirname + "/assets/templates/bucket.html")
});

router.get("/data/bucket", (req, res) => {
  const bucketID = req.query.id;

  if (bucketID == undefined) {
    res.sendStatus(404);
    return;
  }

  var bucketsCollection = mongoDB.collection(DatabaseConstants.BUCKETS_COLLECTION_NAME);
  bucketsCollection.findOne({ bucketID: bucketID }, (err, bucket) => {
    if (err) {
      res.sendStatus(404);
      return;
    }
    
    res.send({ completedGoals: bucket.completedGoals, uncompletedGoals: bucket.uncompletedGoals });
  });
});

router.post("/new/bucket", (req, res) => {
  const bucketID = crypto.randomBytes(20).toString("hex")

  var newBucket = {
    bucketID: bucketID,
    completedGoals: [],
    uncompletedGoals: []
  }

  var bucketsCollection = mongoDB.collection(DatabaseConstants.BUCKETS_COLLECTION_NAME);
  bucketsCollection.insert(newBucket);

  res.send(JSON.stringify({ bucketID: bucketID }));
});

router.post("/new/goal", (req, res) => {
  const json = req.body;
  const bucketID = json.bucketID;
  const goal = json.newGoal;

  var bucketsCollection = mongoDB.collection(DatabaseConstants.BUCKETS_COLLECTION_NAME);
  bucketsCollection.findOne({bucketID: bucketID}, function(err, bucket) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    bucket.uncompletedGoals.push(goal);
    bucketsCollection.update({bucketID: bucketID}, bucket);
  });

  res.sendStatus(200);
});

module.exports = router
