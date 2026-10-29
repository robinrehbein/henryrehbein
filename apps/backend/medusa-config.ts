import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Public address of this backend, e.g. https://api.example.com. Uploaded
// product photos are served from here, so it must be reachable by browsers.
// Unset locally, where Medusa's default http://localhost:9000/static applies.
const PUBLIC_URL = process.env.MEDUSA_PUBLIC_URL?.replace(/\/$/, '')

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  modules: PUBLIC_URL
    ? [
        {
          resolve: '@medusajs/medusa/file',
          options: {
            providers: [
              {
                resolve: '@medusajs/medusa/file-local',
                id: 'local',
                options: { backend_url: `${PUBLIC_URL}/static` },
              },
            ],
          },
        },
      ]
    : [],
})
