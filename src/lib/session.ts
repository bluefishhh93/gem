import "server-only";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { validateRequest } from "@/lib/auth";
import { cache } from "react";
import { AuthenticationError, AuthorizationError } from "../use-cases/errors";
import { UserId } from "@/use-cases/types";
import { gettUserRole, getUserInfo } from "@/data-access/users";

export const getCurrentUser = cache(async () => {
  const session = await validateRequest();
  if (!session.user) {
    return undefined;
  }
  const role = await gettUserRole(session.user.id);
  return { ...session.user, role };
});

export const getCurrentUserInfo = cache(async () => {
  const session = await validateRequest();
  if (!session.user) {
    return undefined;
  }
  const userInfo = await getUserInfo(session.user.id);
  return userInfo;
});

export const assertAuthenticated = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
};

export const assertAdmin = async () => {
  const user = await assertAuthenticated();
  if (!user || user.role !== "admin") {
    throw new AuthorizationError();
  }
  return user;
}

export async function setSession(userId: UserId) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}
