const Joi = require('joi')

const registerValidator = (data) => {
    const rule = Joi.object({
        username: Joi.string()
            .regex(/^(?=.*[a-zA-Z])[a-zA-Z0-9_.]+$/)
            .min(6)
            .max(30)
            .required()
            .messages({
                'string.pattern.base': 'Username can only contain letters, numbers, underscores, and periods',
                'string.empty': 'Username is required',
                'any.required': 'Username is required',
                'string.min': 'Username must be at least {#limit} characters long',
                'string.max': 'Username cannot be more than {#limit} characters long'
            }),

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required()
            .messages({
                'string.email': 'Please enter a valid email address',
                'string.empty': 'Email is required',
                'any.required': 'Email is required',
            }),

        password: Joi.string()
            .alphanum()
            .min(8)
            .max(30)
            .required()
            .messages({
                'string.alphanum': 'Password must only contain alphanumeric characters',
                'string.empty': 'Password is required',
                'any.required': 'Password is required',
                'string.min': 'Password must be at least {#limit} characters long',
                'string.max': 'Password cannot be more than {#limit} characters long'
            }),
    })

    return rule.validate(data)
}

const changePasswordValidator = (password) => {
    const newPassword = Joi.string()
        .alphanum()
        .min(8)
        .max(30)
        .required()
        .messages({
            'string.alphanum': 'Password must only contain alphanumeric characters',
            'string.empty': 'Password is required',
            'any.required': 'Password is required',
            'string.min': 'Password must be at least {#limit} characters long',
            'string.max': 'Password cannot be more than {#limit} characters long'
        });

    return newPassword.validate(password);
}

const updateProfileValidator = (profile) => {
    const rule = Joi.object({
        username: Joi.string()
            .regex(/^(?=.*[a-zA-Z])[a-zA-Z0-9_.]+$/)
            .min(6)
            .max(30)
            .required()
            .messages({
                'string.pattern.base': 'Username can only contain letters, numbers, underscores, and periods',
                'string.empty': 'Username is required',
                'any.required': 'Username is required',
                'string.min': 'Username must be at least {#limit} characters long',
                'string.max': 'Username cannot be more than {#limit} characters long'
            }),

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required()
            .messages({
                'string.email': 'Please enter a valid email address',
                'string.empty': 'Email is required',
                'any.required': 'Email is required',
            }),

        full_name: Joi.string()
            .min(0)
            .max(50),

        bio: Joi.string()
            .min(0)
            .max(150),
    })

    return rule.validate(profile)
}


module.exports = { registerValidator, changePasswordValidator, updateProfileValidator }
