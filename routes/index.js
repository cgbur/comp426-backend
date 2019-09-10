import express from "express";

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send({status: 'You have reached the root!'})
});

export default router;
export const prefix = '/';
