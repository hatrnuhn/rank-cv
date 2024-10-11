import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getProfiles } from "./.server/models";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')
    const profiles = await getProfiles(query)
    return json(profiles, { status: 200 })
}