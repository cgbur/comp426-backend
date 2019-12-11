import express from "express";

export const router = express.Router();
export const prefix = '/';


/**
 * Hello world for the root
 */
router.get(prefix, function (req, res) {
  res.send("Root");
});

