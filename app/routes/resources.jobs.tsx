import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getJobs } from "./.server/models";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')
    console.log(query)
    const jobs = await getJobs(query)
    return json(jobs, { status: 200 })
}