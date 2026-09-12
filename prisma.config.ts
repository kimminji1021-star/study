import { defineConfig, env } from 'prisma/config'

// Prisma 7은 .env 를 자동으로 읽지 않는다.
try {
  process.loadEnvFile('.env')
} catch {}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    seed: 'tsx --env-file=.env prisma/seed.ts',
  },
})
