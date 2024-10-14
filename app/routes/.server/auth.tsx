// app/services/auth.server.ts
import { GoogleStrategy } from "remix-auth-google";
import { prisma } from "./prisma";
import { Authenticator } from "remix-auth";
import { Admin, Profile } from "@prisma/client";
import { adminSessionStorage, userSesssionStorage } from "./sessions";
import { FormStrategy } from "remix-auth-form";
import bcrypt from "bcryptjs";
import { isAdmin } from "~/lib/types";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.G_OAUTH2_CID!,
    clientSecret: process.env.G_OAUTH2_CSECRET!,
    callbackURL: process.env.DOMAIN! + "/auth/google/callback",
  },
  async ({ profile }) => {
    // Get the user data from your DB or API using the tokens and profile
    return await prisma.profile.upsert({
      where: {
        email: profile.emails[0].value,
      },
      update: {},
      create: {
        name: profile.displayName,
        email: profile.emails[0].value,
        image: profile.photos[0].value || "",
      },
    });
  },
);

export const userAuthenticator = new Authenticator<Profile>(
  userSesssionStorage,
);
userAuthenticator.use(googleStrategy);

const adminStrategy = new FormStrategy(async ({ form }) => {
  const username = form.get("username");
  const password = form.get("password");
  const admin = { username, password };

  if (!isAdmin(admin)) throw new Error("unauthenticated");

  const adminDb = await prisma.admin.findUniqueOrThrow({
    where: {
      username: admin.username,
    },
  });

  await bcrypt.compare(admin.password, adminDb.password);

  return {
    id: adminDb.id,
    username: adminDb.username,
  };
});

export const adminAuthenticator = new Authenticator<Omit<Admin, "password">>(
  adminSessionStorage,
);
adminAuthenticator.use(adminStrategy);
