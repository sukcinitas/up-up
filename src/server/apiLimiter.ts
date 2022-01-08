import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

export default rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  handler(req: Request, res: Response) {
    res.json({
      success: false,
      message: 'Too many requests, please try again later.',
    });
  },
});
