import express from "express";
import {authorizeUser} from "../middlewares/auth";
import bcrypt from 'bcrypt';
import {userFilter} from "../filters/user";
import jwt from 'jsonwebtoken';

export const router = express.Router();
export const prefix = '/user';

const saltRounds = 10;

const {userStore} = require('../data/DataStore');


/* GET users listing. */
router.post('/status', authorizeUser, function (req, res, next) {
    res.send(
        {
            user: {
                name: req.user.name,
                ...userFilter(userStore.get(`users.${req.user.name}`))
            }
        }
    );
});

router.post('/login', async function (req, res) {
    if (!req.body.name || !req.body.pass) {
        res.status(401).send({msg: 'Expected a payload of name and pass.'});
        return;
    }

    const name = req.body.name.toLowerCase();
    const pass = req.body.pass;

    let user = userStore.get(`users.${name}`);
    if (!user) {
        res.status(401).send({msg: `User '${req.body.name}' is not a registered user.`});
        return;
    }
    const result = await checkUser(name, pass);
    if (!result) {
        res.status(401).send({msg: 'Bad username or password.'});
        return;
    }
    const token = jwt.sign({
        name,
        data: userStore.get(`users.${name}.data`)
    }, process.env.SECRET_KEY, {expiresIn: '30d'});

    res.send({jwt: token});
});


router.post('/create', function (req, res) {
    if (!req.body.name || !req.body.pass) {
        res.status(401).send({msg: 'Expected a payload of name and pass.'});
        return;
    }

    const name = req.body.name.toLowerCase();
    const pass = req.body.pass;


    let user = userStore.get(`users.${name}`);
    if (user) {
        res.status(401).send({msg: `User '${req.body.name}' is already a registered user.`});
        return;
    }

    bcrypt.hash(pass, saltRounds, (err, hash) => {
        userStore.set(`users.${name}`, {
            passwordHash: hash,
            data: req.body.data
        });
        res.send({data: userFilter(userStore.get(`users.${name}`)), status: 'Successfully made account'});
    });

});


async function checkUser(username, password) {
    const user = userStore.get(`users.${username}`);
    return await bcrypt.compare(password, user.passwordHash);
}
