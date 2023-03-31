import Joi from 'joi';
const { Restaurant } = require('../models/restaurant.model');

const menu = Joi.object({
    title: Joi.string()
        .required()
        .messages({ 'string.empty': 'Title is required' }),
    description: Joi.string()
        .required()
        .messages({ 'string.empty': 'Description is required' }),
    image: Joi.string()
        .required()
        .messages({ 'string.empty': 'Image is required' }),
    price: Joi.number()
        .required()
        .greater(0)
        .messages({
            'string.empty': 'Price is required',
            'number.greater': 'Price must be greater than 0',
        }),
    restaurantId: Joi.string()
        .required()
        .messages({ 'string.empty': 'Restaurant is required' })
        .external(async (value, helpers) => {
            const restaurant = await Restaurant.findOne({ id: value });
            if (!restaurant) {
                return helpers.error('any.invalid', {
                    message: 'Restaurant not found',
                });
            }
            return value;
        }),
});

export default {  menu };
