const express = require('express');
const router = express.Router();
const {getParents, getStudents, getParentByEmail, createStudent, getStudentById, getParentById, createService, enrollStudent, registerParent, getParentDashBoardDetails} = require('../../db/schema');
const {sqlSelectAll, sqlGetOneById, sqlCreateOne} = require('../../utils/sqlActions');
const { authMiddleware } = require('../../utils/auth');


//GET Routes.
router.get('/parents', async (req, res) => {
   sqlSelectAll(req, res, getParents);
})

router.get('/students', async (req, res) => {
    sqlSelectAll(req, res, getStudents);
});

router.get('/student/:id', authMiddleware, async (req, res) => {
    sqlGetOneById(req, res, getStudentById);
})

router.get('/parent/:id', authMiddleware, async (req, res) => {
    sqlGetOneById(req, res, getParentById);
})

router.get('/parent/:parentId/dashboard', authMiddleware, async (req,res) => {
    sqlSecureSelect(req, res, getParentDashBoardDetails);
})

//POST Routes.

router.post('/student', authMiddleware, async (req, res) => {
        sqlCreateOne(req, res, createStudent, "student");
});

router.post('/service', authMiddleware, async (req, res) => {
        sqlCreateOne(req, res, createService, "service");
});

router.post('/enroll/student/:studentId/service/:serviceId', async (req, res) => {
    sqlCreateOne(req, res, enrollStudent, "enrollment");
});

router.post('/register/parent', async (req, res) => {
    sqlCreateOne(req, res, registerParent, "parent-registration");
})

router.post('/login', async (req, res) => {
    sqlCreateOne(req, res, getParentByEmail, "login");
})

module.exports = router;