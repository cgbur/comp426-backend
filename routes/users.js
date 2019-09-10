import express from "express";

const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send({msg: "hello from users"});
});

export default router;
export const prefix = '/users';
