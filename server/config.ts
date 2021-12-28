const config = {
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI ?? '',
  MONGODB_DB: process.env.MONGODB_DB ?? '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? '',
  STRIPE_PUB_KEY: process.env.STRIPE_PUB_KEY ?? '',
  JWT_KEY: process.env.JWT_KEY ?? '',
  PORT: process.env.PORT ?? 3000,
}

export default config;