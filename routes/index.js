const express = require('express');
const router = express.Router();

const {
  jwtMiddleware,
  authMiddleware,
  accessMiddleware,
} = require('../utils/auth');
const {
  StudentController,
  CompanyController,
  AuthController,
  ContestController,
  JobFairController,
 } = require('../controllers');

// AuthController
router.post('/auth/login', authMiddleware, AuthController.login);
router.post('/auth/register', AuthController.register);
router.post('/auth/changePassword', jwtMiddleware.required, AuthController.changePassword);

// StudentController
router.get('/students', jwtMiddleware.required, StudentController.getStudents);
router.get('/students/:id', jwtMiddleware.required, StudentController.getStudentById);
router.post(
  '/students/:id/biography',
  jwtMiddleware.required,
  accessMiddleware('student'),
  StudentController.saveBiography,
);

// CompaniesController
router.get('/companies', jwtMiddleware.required, CompanyController.getCompanies);
router.get('/companies/:id', jwtMiddleware.required, CompanyController.getCompanyById);
router.post(
  '/companies/:id/review',
  jwtMiddleware.required,
  accessMiddleware('student'),
  CompanyController.saveCompanyReview,
);

// ContestController
router.get('/contests', ContestController.getContests);
router.get('/contests/:id', ContestController.getContestById);
router.post('/contests/:id/applications', ContestController.saveContestApplication);

// JobFairController
router.get('/jobfairs', JobFairController.getJobFairs);
router.get('/jobfairs/:id', JobFairController.getJobFairById);
router.post('/jobfairs', JobFairController.saveJobFair);
router.post(
  '/jobfairs/:id/applications',
  jwtMiddleware.required,
  accessMiddleware('company', 'admin'),
  JobFairController.saveJobFairApplication,
);

module.exports = router;
