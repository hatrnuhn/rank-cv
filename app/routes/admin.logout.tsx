import { ActionFunctionArgs } from "@remix-run/node";
import { adminAuthenticator } from "./.server/auth";

export const action = async ({ request } : ActionFunctionArgs) => {
    await adminAuthenticator.logout(request, {
        redirectTo: '/admin/login'
    })
}