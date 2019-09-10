import express from "express";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import debug from 'debug';

// Loggers used. Environment variables used to limit output
const debugAutoWire = debug('auto-wire');
const debugAutoWireWarning = debug('auto-wire-warning');

const app = express();

app.use(require('morgan')('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// auto-wire routes. Must export default router, and a prefix.
fs.readdir('./routes', (err, files) => {
    files.forEach(file => {
        const router = require(path.join(__dirname, './routes', file));

        if (!router.default) {
            debugAutoWireWarning(`'${file}' did not have a default export. Skipped`);
            return;
        }
        if (!router.prefix) {
            debugAutoWireWarning(`'${file}' did not export a 'prefix' path. Defaulting to '/'`);
        }

        app.use(router.prefix || '/', router.default);
        debugAutoWire(`registered '${file}' to route '${router.prefix || '/'}'`);
    });
});

export default app;
