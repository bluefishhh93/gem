import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.string().optional(),
    DATABASE_URL: z.string().min(1),
    DB_AUTH_TOKEN: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    HOST_NAME: z.string().min(1),
    NODE_EMAIL_SERVER_HOST: z.string().min(1),
    NODE_EMAIL_SERVER_PORT: z.string().min(1),
    NODE_EMAIL_SERVER_SECURE: z.string().min(1),
    NODE_EMAIL_SERVER_USER: z.string().min(1),
    NODE_EMAIL_SERVER_PASSWORD: z.string().min(1),
    NODE_EMAIL_FROM: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    
  },
  client: {
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1),
    NEXT_PUBLIC_UPLOAD_PRESET: z.string().min(1),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
    NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    DB_AUTH_TOKEN: process.env.DB_AUTH_TOKEN,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    HOST_NAME: process.env.HOST_NAME,
    NODE_EMAIL_SERVER_HOST: process.env.NODE_EMAIL_SERVER_HOST,
    NODE_EMAIL_SERVER_PORT: process.env.NODE_EMAIL_SERVER_PORT,
    NODE_EMAIL_SERVER_SECURE: process.env.NODE_EMAIL_SERVER_SECURE,
    NODE_EMAIL_SERVER_USER: process.env.NODE_EMAIL_SERVER_USER,
    NODE_EMAIL_SERVER_PASSWORD: process.env.NODE_EMAIL_SERVER_PASSWORD,
    NODE_EMAIL_FROM: process.env.NODE_EMAIL_FROM,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    NEXT_PUBLIC_UPLOAD_PRESET: process.env.NEXT_PUBLIC_UPLOAD_PRESET,
  },
});
