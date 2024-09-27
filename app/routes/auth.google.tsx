// app/routes/auth.google.tsx
import { redirect, type ActionFunctionArgs } from '@remix-run/node'
import { authenticator } from './.server/auth'

export let loader = () => redirect('/login')

export let action = ({ request }: ActionFunctionArgs) => {
  return authenticator.authenticate('google', request)
}