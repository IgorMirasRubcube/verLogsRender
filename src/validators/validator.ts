import { NextFunction, Request, Response } from "express";
import { Result, ValidationChain, check, checkSchema, validationResult } from 'express-validator';
import { containsSequence, isValidBirthDate, isValidCPF, noRepeatRegex, passwordRegex } from 'utils/validationUtil'

export abstract class ValidationRules {
    static userWithoutPassword: ValidationChain[] = [
        check('full_name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('phone', 'Please include a valid phone number').isLength({ min: 11, max: 11 }),
        check('cpf').custom(cpf => isValidCPF(cpf)),
        check('birth_date').isISO8601().custom(birth_date_string => isValidBirthDate(birth_date_string)),
    ];

    static address: ValidationChain[] = [
        check('cep', 'Cep is required').isLength({ min: 8 }),
        check('street', 'Street is required').not().isEmpty(),
        check('number', 'Number is required').not().isEmpty(),
        check('neighborhood', 'Neighborhood is required').not().isEmpty(),
        check('city', 'City is required').not().isEmpty(),
        check('state', 'State is required').isLength({ min: 2, max: 2 })
    ];

    static password: ValidationChain[] = [
      check('password')
        .matches(passwordRegex)
        .withMessage('Password must have at least 8 characters, incluiding letters, numbers and !@#$%^&*')
        .matches(noRepeatRegex)
        .withMessage('Password cannot have 3 repeated letters or numbers')
        .custom(password => !containsSequence(password))
        .withMessage('Password cannot have sequencial letters or numbers')
    ]
    static account: ValidationChain[] = [
      check('transaction_password', 'Transaction password is required').isLength({ min: 4, max: 4 }).isInt(),
    ];

}

export const validate = (schemas: ValidationChain[])  => {
    console.log('passou aq')
    return async (req: Request, res: Response, next: NextFunction) => {
      await Promise.all(schemas.map((schema) => schema.run(req)));

      const errors: Result = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
      return res.status(422).json({ errors: errors.array() });
    };
}