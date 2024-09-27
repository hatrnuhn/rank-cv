import { GoogleStrategy } from "remix-auth-google";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session";
import { Profile } from "./types";
import { prisma } from "./prisma";


const googleStrat = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    callbackURL: 'https://5173-idx-rank-cv-1727278523892.cluster-mwrgkbggpvbq6tvtviraw2knqg.cloudworkstations.dev/auth/google/callback',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!
}, async ({ accessToken, extraParams, profile, request, context, refreshToken }) => {
    const email = profile.emails[0].value
    let user = prisma.profile.upsert({
        where: {
            email
        },
        update: {},
        create: {
            email,
            image: profile.photos[0].value,
            name: profile.displayName
        }
    })

    return user
})

export const authenticator = new Authenticator<Profile>(sessionStorage)

authenticator.use(googleStrat)