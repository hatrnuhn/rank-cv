import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getProfiles } from "./.server/models";
import { adminAuthenticator } from "./.server/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const admin = await adminAuthenticator.isAuthenticated(request);
  if (!admin) return new Response(null, { status: 401 });

  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const profiles = await getProfiles(query);
  return json(profiles, { status: 200 });
};
