import Joi from 'joi';

const adminLogin = Joi.object({
    email: Joi.string()
        .required()
        .email()
        .messages({
            'string.email': 'Email is not valid',
            'string.empty': 'Email is required',
        }),

    password: Joi.string()
        .required()
        .messages({ 'string.empty': 'Password is required' }),
});

const changePassword = Joi.object({
    oldPassword: Joi.string()
        .required()
        .messages({ 'string.empty': 'Old password is required' }),
    newPassword: Joi.string()
        .required()
        .min(6)
        .max(20)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/)
        .custom((value, helpers) => {
            if (value === helpers.state.ancestors[1].oldPassword) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .messages({
            'string.empty': 'New password is required',
            'string.min': 'New password must be at least 6 characters',
            'string.max': 'New password must be at most 20 characters',
            'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'any.invalid': 'New password must be different from old password',
            
        }),
});

export default { adminLogin, changePassword };
