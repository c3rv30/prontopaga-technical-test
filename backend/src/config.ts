import { z } from 'zod';

const DEV_JWT_SECRET = 'dev-only-jwt-secret-never-use-in-production';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  JWT_SECRET: z.string().min(32).optional(),
});

export interface Config {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  jwtSecret: string;
}

export function loadConfig(env: NodeJS.ProcessEnv): Config {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    throw new Error(
      `Invalid environment configuration:\n${z.prettifyError(result.error)}`,
    );
  }

  const { NODE_ENV, PORT, JWT_SECRET } = result.data;
  if (NODE_ENV === 'production' && !JWT_SECRET) {
    throw new Error('JWT_SECRET is required in production');
  }

  return {
    nodeEnv: NODE_ENV,
    port: PORT,
    jwtSecret: JWT_SECRET ?? DEV_JWT_SECRET,
  };
}
