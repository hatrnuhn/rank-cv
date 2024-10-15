import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getJob, getProfiles } from "./.server/models";
import axios, { isAxiosError } from "axios";
import { Score } from "~/lib/types";
import { adminAuthenticator } from "./.server/auth";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const admin = await adminAuthenticator.isAuthenticated(request);
  if (!admin) return new Response(null, { status: 401 });

  const job = await getJob(params.jobId!);
  const candidates = await getProfiles();

  try {
    const response = await axios.post<Score[]>(
      process.env.FLASK_API_URL! + "/applicants/ranks",
      {
        job_description: job?.description,
        candidates: candidates.map((c) => ({
          id: c.id,
          resume: c.resume,
        })),
      },
      {
        headers: {
          Authorization: process.env.NODE_ENV !== 'production' ? `Bearer ${process.env.FLASK_API_TOKEN}` : undefined,
        },
      },
    );

    return json(
      response.data.map(
        (s) => candidates.filter((c) => c.id === s.candidateId)[0],
      ),
      { status: 201 },
    );
  } catch (err) {
    console.log(err);
    if (isAxiosError(err)) {
      if (err.response?.status === 404) return json(503, { status: 503 });
    }

    return json(500, { status: 500 });
  }
};
