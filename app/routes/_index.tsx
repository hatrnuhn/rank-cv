import { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Footer, GoogleLoginButton, JobsList, ProfileSettings, UploadForm } from "../components";
import type { Job } from "../types";
import { useState } from "react";
import { RootIndexProvider } from "~/contexts";
import { authenticator } from "./.server/auth";
import { getJobs } from "./.server/loaders";

export const meta: MetaFunction = () => {
  return [
    { title: "Job Portal" },
    { name: "Job Portal", content: "Welcome to the Job Portal" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request)
  const jobs = await getJobs()

  return json({
    user,
    jobs
  }, { status: 200 })
}

export default function Index() {
  const { jobs, user } = useLoaderData<typeof loader>()
  const [isJobDescShown, setIsJobDescShown] = useState(false)
  const [shownJob, setShownJob] = useState<Job | null>(null)

  return (
    <RootIndexProvider value={{isJobDescShown, setIsJobDescShown, shownJob, setShownJob}}>
      <div className="flex flex-col h-full overflow-hidden">
          <header className="flex items-center justify-between px-10 py-6">
            <h1 className="text-xl rounded-full font-bold truncate">Job Portal |</h1>
              {
                user ?
                <ProfileSettings user={user}/> :
                <GoogleLoginButton />
              }
          </header>
          <main className="px-10 grow min-h-0">
            <div className="h-full min-h-0 flex flex-col sm:flex-row sm:items-center gap-32 sm:gap-[10%]">
              <section className="flex flex-col gap-4">
                <h2 className="text-4xl">
                  Thank you for taking an interest for a position at our company
                </h2>
                <p>
                  Simply upload your résumé to start applying. We'll handle the rest.
                </p>
                <div>
                  {
                      !user ?
                      <GoogleLoginButton content=" " /> :
                      <UploadForm />
                  }
                </div>
              </section>
              <section className={`bg-muted flex flex-col gap-4 min-h-0 p-3 rounded-xl shadow-lg sm:w-full sm:min-w-[300px] ${isJobDescShown ? "max-h-full sm:max-h-96" : "delay-100 max-h-28"} origin-top transition-all duration-500 ease-in-out bg-background`}>
                <div className="grow overflow-y-scroll max-h-28">
                  <JobsList jobs={jobs}/>
                </div>
                <div className={`min-h-0 sm:overflow-y-scroll`}>
                  {
                    shownJob && 
                    <p className={`overflow-y-scroll shadow-lg ${isJobDescShown ? "h-full rounded-xl p-3 delay-200" : "h-0"} origin-top transition-all duration-500 ease-in-out bg-background`}>
                      {shownJob.description}
                    </p>
                  }
                </div>
              </section>
            </div>
          </main>
          <footer>
            <Footer />
          </footer>
      </div>
    </RootIndexProvider>
  )
}