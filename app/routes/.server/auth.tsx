// app/services/auth.server.ts
import { GoogleStrategy } from 'remix-auth-google'
import { prisma } from './prisma'
import { Authenticator } from 'remix-auth'
import { Profile } from '@prisma/client'
import { userSesssionStorage } from './sessions'

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.G_OAUTH2_CID!,
    clientSecret: process.env.G_OAUTH2_CSECRET!,
    callbackURL: 'https://5173-idx-rank-cv-1727278523892.cluster-mwrgkbggpvbq6tvtviraw2knqg.cloudworkstations.dev/auth/google/callback',
  },
  async ({ profile }) => {
    // Get the user data from your DB or API using the tokens and profile
    return await prisma.profile.upsert({
        where: {
            email: profile.emails[0].value
        },
        update: {},
        create: {
            name: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value || ''
        }
    })
  }
)

export const userAuthenticator = new Authenticator<Profile>(userSesssionStorage)
userAuthenticator.use(googleStrategy)