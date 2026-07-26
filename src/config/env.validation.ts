import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  RABBITMQ_URL: Joi.string().required(),
  QUEUE_NAME: Joi.string().default('log_export_queue'),
  REDIS_URL: Joi.string().required(),
});
