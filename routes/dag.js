import express from "express";
import {authenticateUser} from "../middlewares/auth";
import bcrypt from 'bcrypt';
import {userFilter} from "../filters/user";
import jwt from 'jsonwebtoken';

export const router = express.Router();
export const prefix = '/account';

const saltRounds = 10;

const {dagStore} = require('../data/DataStore');