import { Request, Response, NextFunction } from 'express';

const authorize = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized');
  }
  return next();
};

export default authorize;
