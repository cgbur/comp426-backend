/**
 * Remember that each of these calls need to be made with the header
 * "Content-Type: application/json" to be parsed properly
 * Required APIs
 *  GET all classes given a major
 *      major -> list(class objects)
 *  GET class given name
 *      classname -> class object
 *  GET prerequisites for a given class
 *      
 *  POST add a class
 *      class object -> status code
 */

import express from "express";
export const router = express.Router();
export const prefix = '/classes';

router.use(express.json());

const {classesStore} = require('../data/DataStore');

// Get all classes given a major for a given semester
router.get('/getClasses', function (req, res) {
    if (req.body){
        let body = req.body;
        if ("major" in body && "semester" in body){
            let retval = [];
            let classes = classesStore.get(`classes`);
            for (let key in classes){
                let val = classes[key];
                if (body.major in val.major && val.semester == body.semester){
                    retval.push(val);
                }
            }
            res.status(200).send(retval);
        } else {
            res.status(400).send("Ensure both 'major' and 'semester' specified in body");
        }
    } else {
        res.status(400).send("Response body not defined. Requires 'major' and 'semester' parameters");
    }
});


// Get class given a name
router.get('/getClass', function (req, res) {

});
// Get prerequisite classes given a class
router.get('/getPrerequisites', function(req, res){

});