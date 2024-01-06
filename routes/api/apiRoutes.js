const express = require('express');
const router = express.Router();
const { promisePool } = require('../../config/connection');
const {getParents, getStudents, createParent, createStudent, getStudentById} = require('../../db/schema');
const {sqlSelectAll, sqlGetOneById, sqlCreateOne} = require('../../utils/sqlActions');

//GET Routes.
router.get('/parents', async (req, res) => {
   sqlSelectAll(req, res, getParents);
})

router.get('/students', async (req, res) => {
    sqlSelectAll(req, res, getStudents);
});

router.get('/student/:id', async (req, res) => {
    sqlGetOneById(req, res, getStudentById);
})

//POST Routes.
router.post('/parent', async (req, res) => {
        sqlCreateOne(req, res, createParent, "parent");
});

router.post('/student', async (req, res) => {
        sqlCreateOne(req, res, createStudent, "student");
});

module.exports = router;