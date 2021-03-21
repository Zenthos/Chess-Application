const express = require('express');
const router = express.Router();
const Thread = require('../models/ThreadModel.js');

router.post('/:category', (req, res, next) => {

});

router.post('/:category/:thread', (req, res, next) => {
  console.log('data recieved');
  res.status(200).json({ msg: "Data Recieved", data: req.body });
});

module.exports = router;

/*

{
    "_id": {
        "$oid": "602c396c9f936a89feefe808"
    },
    "title": "Test Post",
    "comments": [{
        "username": "BobSchmarly",
        "user_id": {
            "$oid": "5f2892a12e64512ca8d8b6bf"
        },
        "body": "Body",
        "_id": {
            "$oid": "5f2a2ac9ea62f82ca8ab3540"
        },
        "date": {
            "$date": {
                "$numberLong": "1596598985066"
            }
        }
    }, {
        "username": "BobSchmarly",
        "user_id": {
            "$oid": "5f2892a12e64512ca8d8b6bf"
        },
        "body": "Comment Number Two",
        "date": {
            "$date": {
                "$numberLong": "1596599150080"
            }
        },
        "_id": {
            "$oid": "5f2a2b6eea62f82ca8ab3541"
        }
    }, {
        "username": "BobSchmarly",
        "user_id": {
            "$oid": "5f2892a12e64512ca8d8b6bf"
        },
        "body": "Paging @Zenthos Yerr",
        "date": {
            "$date": {
                "$numberLong": "1596728284826"
            }
        },
        "_id": {
            "$oid": "5f2c23dcf51cc30bf0e0e7c0"
        }
    }, {
        "username": "Zenthos",
        "user_id": {
            "$oid": "5f2865b4f2785e0758376c57"
        },
        "body": "Paging @BobSchmarly YERRRR",
        "date": {
            "$date": {
                "$numberLong": "1596728344929"
            }
        },
        "_id": {
            "$oid": "5f2c2418c8c6360dac9a52cd"
        }
    }],
    "date": {
        "$date": {
            "$numberLong": "1596598985065"
        }
    },
    "__v": {
        "$numberInt": "0"
    }
}

*/