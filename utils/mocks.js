const faker = require('faker');

const { bussinessAreas, contestTypes, contestApplicationStatus, jobFairScheduleType, jobFairApplicationStatus } = require('../constants');

const imageMock = "data:image/png;base64,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";

const mockUser = () => ({
  _id: faker.random.uuid(),
  username: faker.internet.userName(),
  password: 'teSt#2!3',
});

const mockStudents = (numberOfMocks) => Array.from(
  { length: numberOfMocks },
  mockStudent,
);

const mockStudent = () => ({
  ...mockUser(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  phoneNumber: faker.phone.phoneNumberFormat(),
  email: faker.internet.email(),
  yearOfStudy: faker.random.number(),
  hasGraduated: faker.random.boolean(),
  profileImage: imageMock,
  biography: null,
});

const mockAdmin = () => ({
  ...mockUser(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  phoneNumber: faker.phone.phoneNumberFormat(),
  email: faker.internet.email(),
});

const mockCompanies = (numberOfCompanies) => Array.from(
  { length: numberOfCompanies },
  mockCompany,
);

const mockCompany = () => ({
  ...mockUser(),
  name: faker.company.companyName(),
  city: faker.address.city(),
  address: faker.address.streetAddress(),
  director: faker.name.firstName(),
  pib: faker.random.uuid(),
  numberOfEmployees: faker.random.number(20),
  email: faker.internet.email(),
  website: faker.internet.url(),
  bussinessArea: Object.values(bussinessAreas)[
    faker.random.number(Object.values(bussinessAreas).length - 1)
  ],
  specialization: faker.company.catchPhraseNoun(),
  image: imageMock,
  contests: null,
});

const mockContest = () => ({
  _id: faker.random.uuid(),
  type:
    Object.values(contestTypes)[
    faker.random.number(Object.values(contestTypes).length - 1)
    ],
  position: faker.name.jobDescriptor(),
  from: faker.date.past(),
  to: faker.date.future(),
  description: faker.random.words(20),
});

const mockContests = (numberOfMocks) => Array.from(
  { length: numberOfMocks },
  mockContest,
);

const mockReview = () => ({
  rating: faker.random.number(5),
  comment: faker.random.words(10),
});

const mockReviews = (numberOfMocks) => Array.from(
  { length: numberOfMocks },
  mockReview,
);

const mockContestApplication = () => ({
  status:
    Object.values(contestApplicationStatus)[
    faker.random.number(Object.values(contestApplicationStatus).length - 1)
    ],
  coverLetter: faker.random.words(20),
});

const mockContestApplications = (numberOfMocks) => Array.from(
  { length: numberOfMocks },
  mockContestApplication,
);

const mockBiographyExp = () => ({
  position: faker.name.jobDescriptor(),
  from: faker.date.past(),
  to: faker.date.future(),
  isOngoing: faker.random.boolean(),
  organisationName: faker.company.companyName(),
  city: faker.address.city(),
  country: faker.address.country(),
  description: faker.random.words(20),
});

const mockBiographyExps = (numberOfMocks) => Array.from(
  { length: numberOfMocks },
  mockBiographyExp,
);

const mockBiography = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  streetAddress: faker.address.streetAddress(),
  postalCode: faker.address.countryCode(),
  city: faker.address.city(),
  country: faker.address.country(),
  phoneNumber: faker.phone.phoneNumberFormat(),
  email: faker.internet.email(),
  website: faker.internet.url(),
  skypeName: faker.internet.userName(),
  workExperiences: mockBiographyExps(faker.random.number(2)),
  educationExperiences: mockBiographyExps(faker.random.number(3)),
  spokenLanguages: Array.from({ length: faker.random.number(5) }, () => faker.name.jobType()),
  skills: Array.from({ length: faker.random.number(5) }, () => faker.name.jobType()),
});

const mockBiographies = (numberOfMocks) => Array.from(
  { length: numberOfMocks },
  mockBiography,
);

const mockService = () => ({
  _id: faker.random.uuid(),
  price: faker.random.number(),
  description: faker.random.words(5),
});

const mockPackage = () => ({
  _id: faker.random.uuid(),
  title: faker.name.firstName(),
  videoPromotion: faker.random.number(10),
  numOfLessons: faker.random.number(10),
  numOfWorkshops: faker.random.number(10),
  numOfPresentations: faker.random.number(10),
  totalNumOfCompanies: faker.random.number(10),
  price: faker.random.number(10000),
  content: Array.from({ length: faker.random.number(5) }, faker.random.word),
});

const mockSchedule = (options = {}) => ({
  _id: faker.random.uuid(),
  from: "09:00:00",
  to: "10:00:00",
  area: faker.address.city(),
  type: Object.values(jobFairScheduleType)[
    faker.random.number(Object.values(jobFairScheduleType).length - 1)
  ],
  application: options.noApplication || mockJobFairApplication(),
});

const mockJobFairApplication = () => ({
  _id: faker.random.uuid(),
  company: mockCompany(),
  package: mockPackage(),
  services: mockServices(faker.random.number(3)),
  comment: faker.random.words(5),
  status: Object.values(jobFairApplicationStatus)[
    faker.random.number(Object.values(jobFairApplicationStatus).length - 1)
  ],
  schedule: mockSchedule({
    noApplication: true,
  }),
});

const mockServices = (numberOfMocks) => Array.from(
  { length: numberOfMocks },
  mockService,
);

const mockPackages = (numberOfMocks) => Array.from(
  { length: numberOfMocks },
  mockPackage,
);

const mockSchedules = (numberOfMocks) => Array.from(
  { length: numberOfMocks },
  mockSchedule,
);

const mockJobFairApplications = (numberOfMocks) => Array.from(
  { length: numberOfMocks },
  mockJobFairApplication,
);

const mockJobFair = () => ({
  _id: faker.random.uuid(),
  name: faker.name.jobArea(),
  packages: mockPackages(4),
  services: mockServices(4),
  startDate: faker.date.past(),
  endDate: faker.date.future(),
  logoImage: imageMock,
  startTime: "09:00:00",
  endTime: "17:00:00",
  place: faker.address.city(),
  description: faker.random.words(20),
  areas: Array.from({ length: 10 }, faker.name.jobArea),
  applications: mockJobFairApplications(10),
  schedules: mockSchedules(10),
});


module.exports = {
  mockStudent,
  mockStudents,
  mockCompany,
  mockCompanies,
  mockAdmin,
  mockUser,
  mockContest,
  mockContests,
  mockReview,
  mockReviews,
  mockContestApplication,
  mockContestApplications,
  mockBiography,
  mockBiographies,
  mockJobFair,
};
