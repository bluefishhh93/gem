import { env } from "@/env";
import { applicationName } from "@/app-config";

export const BASE_URL = env.HOST_NAME;

interface VerifyEmailProps {
  token: string;
}

export function generateVerifyEmailText({ token }: VerifyEmailProps): string {
  const verifyLink = `${BASE_URL}/verify-email?token=${token}`;
  return `
    Hi there,

    Click the following link to verify your email:

    ${verifyLink}

    © 2024 ${applicationName}. All rights reserved.
  `;
}
