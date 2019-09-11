import express from "express";

export const router = express.Router();
export const prefix = '/public';

/* GET users listing. */
router.get('/*', function (req, res, next) {
    const p = req.path.split('/').join('.');
    res.send({res: p})
});
