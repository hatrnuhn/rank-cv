import { createCookieSessionStorage } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";

const COOKIE_SECRET = process.env.COOKIE_SECRET || "SecretTerces";
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;
// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === "production";

const themeSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: [COOKIE_SECRET],
    // Set domain and secure only if in production
    ...(isProduction ? { domain: COOKIE_DOMAIN, secure: true } : {}),
  },
});

export const themeSessionResolver =
  createThemeSessionResolver(themeSessionStorage);

export const userSesssionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: [COOKIE_SECRET],
    // Set domain and secure only if in production
    ...(isProduction ? { domain: COOKIE_DOMAIN, secure: true } : {}),
  },
});

export const {
  getSession: getUserSession,
  commitSession: commitUserSession,
  destroySession: destroyUserSession,
} = userSesssionStorage;

export const adminSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_adminSession",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: [COOKIE_SECRET],
    // Set domain and secure only if in production
    ...(isProduction ? { domain: COOKIE_DOMAIN, secure: true } : {}),
  },
});

export const {
  commitSession: commitAdminSession,
  destroySession: destroyAdminSession,
  getSession: getAdminSession,
} = adminSessionStorage;
