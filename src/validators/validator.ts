import { MAX_DESCRIPTION_LENGTH, MIN_TRANSFER_VALUE, MAX_TRANSFER_VALUE } from "constants/index";
import { NextFunction, Request, Response } from "express";
import { Result, ValidationChain, check, validationResult } from 'express-validator';
import { containsSequence,
         isValidBirthDate,
         isValidCPF,
         noRepeatRegex,
         passwordRegex,
         isOnlyNumbers,
         noRepeatNumbersRegex,
         containsDigitsSequence,
         isValidCEP,
         isAfterNow,
         isValidTransferStatus,
         isValidTransferValue,
         isExtractType,
         isValidPeriod,
         isSortType
       } from 'utils/validationUtil'

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
          .custom(async cep => isValidCEP(cep))
          .withMessage('Invalid CEP'),
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

    static cpf: ValidationChain[] = [
      check('cpf')
          .custom(cpf => isOnlyNumbers(cpf))
          .withMessage('Please include only numbers')
          .custom(cpf => isValidCPF(cpf))
          .withMessage('Invalid CPF')
    ];

    static agency: ValidationChain[] = [
      check('agency')
          .custom(agency => isOnlyNumbers(agency))
          .withMessage('Please include only numbers')
          .isLength({ min: 4, max:4 })
          .withMessage('Invalid Agency')
    ];

    static account_number: ValidationChain[] = [
      check('account_number')
          .custom(account_number => isOnlyNumbers(account_number))
          .withMessage('Please include only numbers')
          .isLength({ min: 8, max: 8 })
          .withMessage('Invalid account number')
    ];

    static transfer: ValidationChain[] = [
      check('from_account_id').isUUID(),
      check('to_account_id').isUUID(),
      check('value')
        .isFloat({ min: MIN_TRANSFER_VALUE, max: MAX_TRANSFER_VALUE })
        .withMessage('Invalid value'),
      check('description')
        .optional()
        .isLength({ max: MAX_DESCRIPTION_LENGTH })
        .withMessage('description do not must be greater than 120 characters'),
      check('type')
        .optional()
        .isString(),                            
      check('isScheduled')
        .optional()
        .isBoolean(),
      check('schedule_date')
        .optional()
        .isISO8601()
        .withMessage('Please include a valid date format (YYYY-MM-DD)')
        .custom((schedule_date) => isAfterNow(schedule_date)),
      check('status')
        .optional()
        .custom(status => isValidTransferStatus(status))
        .withMessage('Invalid transfer status')
    ];

    static accountId: ValidationChain[] = [
      check('account_id').isUUID()
    ];

    static userId: ValidationChain[] = [
      check('user_id').isUUID()
    ];

    static transferId: ValidationChain[] = [
      check('transfer_id').isUUID()
    ];

    static transferValue: ValidationChain[] = [
      check('value')
        .isDecimal()
        .withMessage('Invalid value')
        .custom(value => isValidTransferValue(value))
        .withMessage('Do not include negative values')
    ];

    static balance: ValidationChain[] = [
      check('balance')
        .isDecimal()
        .withMessage('Invalid value')
        .custom(balance => isValidTransferValue(balance))
        .withMessage('Do not include negative values')
    ];

    static extract: ValidationChain[] = [
      check('type')
        .custom(type => isExtractType(type))
        .withMessage('Invalid extract type'),
      check('period')
        .isInt()
        .withMessage('Invalid period type (should be number)')
        .custom(period => isValidPeriod(period))
        .withMessage('Invalid period type (should be 15, 30, 60 or 90)'),
      check('sort')
        .custom(sort => isSortType(sort))
    ];
}

export const validate = (schemas: ValidationChain[])  => {
    return async (req: Request, res: Response, next: NextFunction) => {
      await Promise.all(schemas.map((schema) => schema.run(req)));

      const errors: Result = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
      return res.status(422).json({ errors: errors.array() });
    };
}