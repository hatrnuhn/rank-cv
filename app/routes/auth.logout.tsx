import { ActionFunctionArgs } from "@remix-run/node";
import { adminAuthenticator, userAuthenticator } from "./.server/auth";

export const action = async ({ request }: ActionFunctionArgs) => {
    await userAuthenticator.logout(request, {
        redirectTo: '/'
    })
}