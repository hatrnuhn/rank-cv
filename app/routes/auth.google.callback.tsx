// app/routes/auth.google.callback.tsx
import type { LoaderFunctionArgs } from '@remix-run/node'
import { userAuthenticator } from './.server/auth'

export const loader = ({ request }: LoaderFunctionArgs) => {
    return userAuthenticator.authenticate('google', request, {
        successRedirect: '/',
        failureRedirect: '/',
    })
}