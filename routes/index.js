import express from "express";

export const router = express.Router();
export const prefix = '/';


/**
 * Hello world for the root
 */
router.get('/', function (req, res) {
  res.send({
    status: 'You have reached the root of the API!',
    repo: 'https://github.com/cgburgess/comp426-backend'
  })
});

