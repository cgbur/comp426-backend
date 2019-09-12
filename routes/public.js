import express from "express";
import {parsePath} from "../middlewares/parse_path";

export const router = express.Router();
export const prefix = '/public';

const {userStore} = require('../data/DataStore');


/* GET users listing. */
router.get('/*', parsePath, function (req, res, next) {
    const data = req.storeMutate(userStore);
    res.send({data})
});
