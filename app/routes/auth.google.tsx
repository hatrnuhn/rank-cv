import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { userAuthenticator } from "./.server/auth";

export const loader = () => redirect("/");

export const action = ({ request }: ActionFunctionArgs) => {
  return userAuthenticator.authenticate("google", request);
};
