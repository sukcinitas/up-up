import { Request, Response, NextFunction } from 'express';
import { body, validationResult, oneOf, ValidationError } from 'express-validator';

export const validationRules = {
  poll: [
    body('name')
      .not()
      .isEmpty()
      .withMessage(
        'All fields must be filled in for form submission!',
      )
      .trim(),
    body('question')
      .not()
      .isEmpty()
      .withMessage(
        'All fields must be filled in for form submission!',
      )
      .trim(),
  ],
  userUpdate: [
    oneOf([
      body('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email')
        .normalizeEmail()
        .trim(),
      body('oldpassword')
        .exists()
        .withMessage('Password is required'),
    ]),
    oneOf([
      body('password').exists().withMessage('Password is required'),
      body('newpassword')
        .exists()
        .withMessage('Password is required')
        .isLength({ min: 10 })
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/,
        )
        .withMessage(
          'Your password needs to be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character',
        ),
    ]),
  ],
  userRegistration: [
    body('username')
      .exists()
      .withMessage('Username is required')
      .isLength({ min: 5, max: 30 })
      .withMessage(
        'Username needs to be between 5 to 30 characters long',
      ),
    body('password')
      .exists()
      .withMessage('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/,
      )
      .withMessage(
        'Your password needs to be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character',
      ),
  ],
  userLogin: [
    body('username').exists().withMessage('Username is required'),
    body('password').exists().withMessage('Password is required'),
  ],
};

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = errors
    .array()
    .map((err: ValidationError) => `${err.msg}!`);
  const message = extractedErrors.join(' ');

  return res.status(400).json({
    success: false,
    message,
  });
};
