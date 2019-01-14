const { mockJobFair } = require('../utils/mocks');

class JobFairController {
  /**
   * GET: /jobfairs
   * @param {Request} req 
   * @param {Response} res 
   */
  static async getJobFairs(req, res) {
    try {
      const jobFair = mockJobFair();

      res.statusCode = 200;
      res.json([jobFair]);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }

  /**
   * GET: /jobfairs/:id
   * @param {Request} req 
   * @param {Response} res 
   */
  static async getJobFairById(req, res) {
    try {
      const jobFair = mockJobFair();

      res.statusCode = 200;
      res.json(jobFair);
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }

  /**
   * POST: /jobfairs
   * @param {Request} req 
   * @param {Response} res 
   */
  static async saveJobFair(req, res) {
    // const [jobFair] = await JobFair.find({
    //   $and: [{ startDate: { $lte: new Date() } }, { endDate: { $gte: new Date() } }],
    // });
  }

  /**
   * PATCH: /jobfairs/:id
   * @param {Request} req 
   * @param {Response} res 
   */
  static async updateJobFair(req, res) {
    console.log('update test');
    res.status(200);
    res.json('test');
  }

  // TODO: check if we need GET request for fair applications
  /**
   * POST: /jobfairs/:id/applications
   * @param {Request} req 
   * @param {Response} res 
   */
  static async saveJobFairApplication(req, res) {
    console.log('test');
  }

  /**
   * PATCH: /jobfairs/:fairId/applications/:id
   * @param {Request} req 
   * @param {Response} res 
   */
  static async updateJobFairApplication(req, res) {
    console.log('update test');
    res.status(200);
  }
}

module.exports = JobFairController;
