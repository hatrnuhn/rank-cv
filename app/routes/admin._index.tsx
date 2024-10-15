import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getJobs, getProfiles } from "./.server/models";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useEffect, useState } from "react";
import { Job, Profile } from "@prisma/client";
import { loader as candidatesRankLoader } from "./admin.resources.jobs.$jobId.candidates-rank";
import { marked } from "marked";
import { AdminTab, AdminTable } from "~/components/Admin";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Skeleton } from "~/components/ui/skeleton";
import { adminAuthenticator } from "./.server/auth";

export const meta: MetaFunction = () => {
  return [
    { title: "Admin Panel" },
    { name: "description", content: "Admin panel for recruitment team" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const admin = await adminAuthenticator.isAuthenticated(request);
  if (!admin) return new Response(null, { status: 401 });

  const jobs = await getJobs();
  const profiles = await getProfiles();

  return json(
    {
      jobs,
      profiles,
    },
    { status: 200 },
  );
};

export default function AdminIndex() {
  const { jobs, profiles } = useLoaderData<typeof loader>();
  const [job, setJob] = useState<Job | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tab, setTab] = useState<"jobs" | "candidates" | null>(null);

  const { load, ...candidatesRankFetcher } =
    useFetcher<typeof candidatesRankLoader>();

  useEffect(() => {
    if (job) load(`/admin/resources/jobs/${job.id}/candidates-rank`);
  }, [job, load]);

  return (
    <div className="h-full grid grid-rows-3 px-2 py-4 lg:grid-cols-2 lg:grid-rows-2 lg:gap-4">
      <div>
        <Tabs
          defaultValue="jobs"
          onValueChange={(v) => setTab(v as "jobs" | "candidates")}
        >
          <TabsList>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
          </TabsList>
          <TabsContent value="jobs">
            <AdminTab data={jobs} setJob={setJob} />
          </TabsContent>
          <TabsContent value="candidates">
            <AdminTab data={profiles} setProfile={setProfile} />
          </TabsContent>
        </Tabs>
      </div>
      <Card className="bg-muted flex flex-col px-0">
        <CardHeader>
          <CardTitle>{"Top Candidates"}</CardTitle>
        </CardHeader>
        <CardContent
          className={`overflow-scroll ${candidatesRankFetcher.state !== "idle" ? "flex justify-center items-center" : ""}`}
        >
          {candidatesRankFetcher.state !== "idle" && (
            <div className="w-full flex flex-col pt-2 gap-2 lg:pt-0">
              {window.innerWidth < 1024
                ? Array(5)
                    .fill("")
                    .map((_, i) => <Skeleton key={i} className="h-7" />)
                : Array(9)
                    .fill("")
                    .map((_, i) => <Skeleton key={i} className="h-7" />)}
            </div>
          )}
          {candidatesRankFetcher.data &&
            candidatesRankFetcher.state === "idle" &&
            typeof candidatesRankFetcher.data !== "number" && (
              <AdminTable
                colNames={
                  tab === "jobs"
                    ? ["Rank", "Name", "Email"]
                    : ["Rank", "Name", "Email"]
                }
                data={candidatesRankFetcher.data}
                pushFn={setProfile}
              />
            )}
          {candidatesRankFetcher.data &&
            candidatesRankFetcher.state === "idle" &&
            typeof candidatesRankFetcher.data == "number" && (
              <Alert>
                <AlertTitle>Oops!</AlertTitle>
                <AlertDescription>
                  {candidatesRankFetcher.data === 503 &&
                    "Service is currently unavailable, please try again later."}
                  {candidatesRankFetcher.data === 500 &&
                    "Internal server error, please try again."}
                </AlertDescription>
              </Alert>
            )}
        </CardContent>
      </Card>
      <div className="lg:col-start-2 lg:row-start-1 lg:row-end-3">
        <Tabs defaultValue="job" className="h-full flex flex-col">
          <TabsList className="w-fit my-4">
            <TabsTrigger value="job">Job</TabsTrigger>
            <TabsTrigger value="candidate">Candidate</TabsTrigger>
          </TabsList>
          <Card className={`bg-muted h-full overflow-hidden`}>
            <CardContent className="h-full p-4">
              <ScrollArea className="h-full">
                <TabsContent value="job">
                  {job && (
                    <div
                      className="innerHTML"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                  )}
                </TabsContent>
                <TabsContent value="candidate">
                  {profile && (
                    <div
                      className="innerHTML"
                      dangerouslySetInnerHTML={{
                        __html: marked(profile.resume!),
                      }}
                    />
                  )}
                </TabsContent>
              </ScrollArea>
            </CardContent>
          </Card>
          <TabsContent value="candidate"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
