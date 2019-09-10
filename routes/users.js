import express from "express";
import {authorizeUser} from "../middleware/auth";
import {userStore} from "../data/DataStore";

const router = express.Router();

/* GET users listing. */
router.get('/user-status', authorizeUser, function (req, res, next) {
    console.log(userStore.get());
    res.send({result: 'all good', user: req.user, data: userStore.get('public')});
});

export default router;
export const prefix = '/user';
