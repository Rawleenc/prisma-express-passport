import joi from 'joi';

export const registerSchema = joi.object().keys({
  email: joi.string().trim().email().required(),
  password: joi.string().min(6).required(),
  displayName: joi.string().min(3).required(),
});

export const loginSchema = joi.object().keys({
  email: joi.string().trim().email().required(),
  password: joi.string().min(6).required(),
});

export const userSchema = joi.object().keys({
  email: joi.string().trim().email().optional(),
  password: joi.string().min(6).optional(),
  displayName: joi.string().min(3).optional(),
});

export const postSchema = joi.object().keys({
  title: joi.string().required(),
  content: joi.string().required(),
  //Keeping this here to not generate another schema for Update unlike register & login
  published: joi.boolean().optional(),
});
