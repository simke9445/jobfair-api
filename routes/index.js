const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

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

const userImageUpload = multer({
  dest: 'public/images/user/',
});

const fairImageUpload = multer({
  dest: 'public/images/fair',
});

const contestFileUpload = multer({
  dest: 'public/files/contest',
});

// AuthController
router.post('/auth/login', authMiddleware, AuthController.login);
router.post('/auth/register', userImageUpload.single('image'), AuthController.register);
router.post('/auth/changePassword', AuthController.changePassword);

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
router.get('/companies', jwtMiddleware.optional, CompanyController.getCompanies);
router.get('/companies/:id', jwtMiddleware.optional, CompanyController.getCompanyById);
router.post(
  '/companies/:id/review',
  jwtMiddleware.required,
  accessMiddleware('student'),
  CompanyController.saveCompanyReview,
);

// ContestController
router.get('/contests', jwtMiddleware.optional, ContestController.getContests);
router.get('/contests/:id', jwtMiddleware.optional, ContestController.getContestById);
router.post(
  '/contests',
  jwtMiddleware.required,
  accessMiddleware('company'),
  ContestController.saveContest,
);
router.post(
  '/contests/:id/applications',
  jwtMiddleware.required,
  accessMiddleware('student'),
  contestFileUpload.any(),
  ContestController.saveContestApplication,
);
router.patch(
  '/contests/:id/applications',
  jwtMiddleware.required,
  accessMiddleware('company'),
  ContestController.updateContestApplications,
);

// JobFairController
router.get('/jobfairs', jwtMiddleware.required, JobFairController.getJobFairs);
router.get('/jobfairs/:id', jwtMiddleware.required, JobFairController.getJobFairById);
router.patch(
  '/jobfairs/:id',
  jwtMiddleware.required,
  accessMiddleware('admin', 'company'),
  JobFairController.updateJobFair,
);
router.post('/jobfairs', fairImageUpload.single('logoImage'), JobFairController.saveJobFair);
router.post(
  '/jobfairs/:id/images',
  jwtMiddleware.required,
  accessMiddleware('admin'),
  fairImageUpload.single('logoImage'),
  JobFairController.uploadJobFairImages,
);
router.post(
  '/jobfairs/:id/applications',
  jwtMiddleware.required,
  accessMiddleware('company', 'admin'),
  JobFairController.saveJobFairApplication,
);
router.patch(
  '/jobfairs/:fairId/applications/:id',
  jwtMiddleware.required,
  accessMiddleware('admin'),
  JobFairController.updateJobFairApplication,
);

module.exports = router;
