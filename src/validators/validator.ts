import { NextFunction, Request, Response } from "express";
import { Result, ValidationChain, check, validationResult } from 'express-validator';
import { containsSequence, isValidBirthDate, isValidCPF, noRepeatRegex, passwordRegex, isOnlyNumbers, noRepeatNumbersRegex, containsDigitsSequence } from 'utils/validationUtil'

export abstract class ValidationRules {
    static userWithoutPassword: ValidationChain[] = [
        check('full_name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('phone', 'Please include a valid phone number')
          .isLength({ min: 11, max: 11 })
          .custom(phone => isOnlyNumbers(phone))
          .withMessage('Please include only numbers'),
        check('cpf')
          .custom(cpf => isOnlyNumbers(cpf))
          .withMessage('Please include only numbers')
          .custom(cpf => isValidCPF(cpf))
          .withMessage('Invalid CPF'),
        check('birth_date').isISO8601().custom(birth_date_string => isValidBirthDate(birth_date_string)),
    ];

    static address: ValidationChain[] = [
        check('cep', 'CEP is required')
          .isLength({ min: 8, max: 8 })
          .withMessage('Invalid CEP')
          .custom(cep => isOnlyNumbers(cep))
          .withMessage('Please include only numbers'),
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

    static transferPassword: ValidationChain[] = [
      check('transfer_password')
        .isLength({ min: 4, max: 4 })
        .withMessage('Transfer password must have exactly 4 digits')
        .custom(transfer_password => isOnlyNumbers(transfer_password))
        .withMessage('Please include only numbers')
        .matches(noRepeatNumbersRegex)
        .withMessage('Transfer Password cannot have 3 repeated digits')
        .custom(transfer_password => !containsDigitsSequence(transfer_password))
        .withMessage('Transfer Password cannot have 3 sequencial digits')
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