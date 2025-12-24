import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

type EnvConfig = z.infer<typeof envSchema>;

let env: EnvConfig;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:');
    error.errors.forEach((err) => {
      console.error(`  ${err.path.join('.')}: ${err.message}`);
    });
    // Don't exit in serverless environment - throw error instead
    // This allows the handler to catch and return proper error response
    if (process.env.VERCEL) {
      throw new Error(`Missing required environment variables: ${error.errors.map(e => e.path.join('.')).join(', ')}`);
    }
    process.exit(1);
  }
  throw error;
}

export default env;


