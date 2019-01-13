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
}

module.exports = JobFairController;
