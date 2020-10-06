import * as rateLimit from 'express-rate-limit';

export default rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  handler(req, res) {
    res.json({ success: false, message: 'Too many requests, please try again later.' });
  },
});
