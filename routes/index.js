import express from "express";

export const router = express.Router();
export const prefix = '/';


/* GET home page. */
router.get('/', function (req, res, next) {
    res.send({status: 'You have reached the root!'})
});

