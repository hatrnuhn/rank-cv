import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getJob, getProfiles } from "./.server/models";
import axios from "axios";
import { Score } from "~/lib/types";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const job = await getJob(params.jobId!)
    const candidates = await getProfiles()

    const response = await axios.post<Score[]>(process.env.FLASK_API_URL! + '/jobs/ranks', {
        job_description: job?.description,
        candidates: candidates.map(c => ({
            id: c.id,
            resume: c.resume
        }))
    }, {
        headers: {
            Authorization: `Bearer ${process.env.FLASK_API_TOKEN}`
        }
    })

    return json(response.data.map(s => candidates.filter(c => c.id === s.candidateId)[0]), { status: 201 })
}