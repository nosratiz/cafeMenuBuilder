import Joi from "joi";

const adminLogin = Joi.object({
    email: Joi.string().required().email().messages({ "string.email": "Email is not valid", "string.empty": "Email is required"  }),

    password: Joi.string().required().messages({ "string.empty": "Password is required"  }),
});


export default { adminLogin };