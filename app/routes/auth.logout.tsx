import { ActionFunctionArgs } from "@remix-run/node";
import { userAuthenticator } from "./.server/auth";

export const action = async ({ request }: ActionFunctionArgs) => {
  await userAuthenticator.logout(request, {
    redirectTo: "/",
  });
};
