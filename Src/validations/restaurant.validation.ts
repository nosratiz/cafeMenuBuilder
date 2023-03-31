import Joi from 'joi';

import RestaurantModel from '../models/restaurant.model';

const createRestaurant = Joi.object({
    name: Joi.string()
        .required()
        .external(async (value, helpers) => {
            const restaurant = await RestaurantModel.findOne({
                name: { $regex: new RegExp(value, 'i') },
            });

            if (restaurant) {
                return helpers.error('any.invalid', {
                    message: 'restaurant already exist',
                });
            }
            return value;
        })
        .messages({
            'string.empty': 'Name is required',
            'any.invalid': 'restaurant already exist',
        }),
    logo: Joi.string()
        .required()
        .messages({ 'string.empty': 'Logo is required' }),
    description: Joi.string()
        .required()
        .messages({ 'string.empty': 'Description is required' }),
    address: Joi.object({
        state: Joi.string()
            .required()
            .messages({ 'string.empty': 'State is required' }),
        city: Joi.string()
            .required()
            .messages({ 'string.empty': 'City is required' }),
        street: Joi.string()
            .required()
            .messages({ 'string.empty': 'Street is required' }),
        phone: Joi.string()
            .required()
            .messages({ 'string.empty': 'Phone is required' }),
    }),
    location: Joi.object({
        lat: Joi.number()
            .required()
            .messages({ 'string.empty': 'Latitude is required' })
            .custom((value, helpers) => {
                if (value < -90 || value > 90) {
                    return helpers.error('any.invalid');
                }
                return value;
            }, 'Latitude validation'),

        lng: Joi.number()
            .required()
            .messages({ 'string.empty': 'Longitude is required' })
            .custom((value, helpers) => {
                if (value < -180 || value > 180) {
                    return helpers.error('any.invalid');
                }
                return value;
            }, 'Longitude validation'),
    }),
});

const updateRestaurant = Joi.object({
    name: Joi.string()
        .required()
        .messages({ 'string.empty': 'Name is required' }),

    logo: Joi.string()
        .required()
        .messages({ 'string.empty': 'Logo is required' }),
    description: Joi.string()
        .required()
        .messages({ 'string.empty': 'Description is required' }),
    address: Joi.object({
        state: Joi.string()
            .required()
            .messages({ 'string.empty': 'State is required' }),
        city: Joi.string()
            .required()
            .messages({ 'string.empty': 'City is required' }),
        street: Joi.string()
            .required()
            .messages({ 'string.empty': 'Street is required' }),
        phone: Joi.string()
            .required()
            .messages({ 'string.empty': 'Phone is required' }),
    }),
    location: Joi.object({
        lat: Joi.number()
            .required()
            .messages({ 'string.empty': 'Latitude is required' })
            .custom((value, helpers) => {
                if (value < -90 || value > 90) {
                    return helpers.error('any.invalid');
                }
                return value;
            }, 'Latitude validation'),

        lng: Joi.number()
            .required()
            .messages({ 'string.empty': 'Longitude is required' })
            .custom((value, helpers) => {
                if (value < -180 || value > 180) {
                    return helpers.error('any.invalid');
                }
                return value;
            }, 'Longitude validation'),
    }),
})
    .external(async (value, helpers) => {
        const restaurant = await RestaurantModel.findOne({
            name: value.name,
            _id: { $ne: value.id },
        });

        if (restaurant) {
            return helpers.error('any.invalid', {
                message: 'restaurant already exist',
            });
        }
        return value;
    })
    .messages({ 'any.invalid': 'restaurant already exist' });

export default { createRestaurant, updateRestaurant };
