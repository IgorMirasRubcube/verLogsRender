import { NextFunction, Request, Response } from "express";
import { check, validationResult } from 'express-validator';
import { isValidBirthDate, isValidCPF } from 'utils/validationUtil'

export const userValidationRules = () => {
    return [
        check('full_name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('phone', 'Please include a valid phone number').isLength({ min: 11, max: 11 }),
        check('cpf').custom(cpf => isValidCPF(cpf)),
        check('birth_date').isISO8601().custom(birth_date_string => isValidBirthDate(birth_date_string)),
        check('password').isLength({ min: 8 })
    ]
}

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(422).json({ errors: errors.array() });
}