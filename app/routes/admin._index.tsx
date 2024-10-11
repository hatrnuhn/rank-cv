import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node"
import { AdminTab, AdminTable } from "~/components"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { getJobs, getProfiles } from "./.server/models"
import { useFetcher, useLoaderData } from "@remix-run/react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { useEffect, useState } from "react"
import { Job, Profile } from "@prisma/client"
import { Score } from "~/lib/types"
import { loader as candidatesRankLoader } from "./admin.resources.jobs.$jobId.candidates-rank"
import { marked } from 'marked'

export const meta: MetaFunction = () => {
    return [
        {title: 'Admin Panel'},
        {name: 'description', content: 'Admin panel for recruitment team'}
    ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const jobs = await getJobs()
    const profiles = await getProfiles()

    return json({
        jobs,
        profiles
    }, { status: 200 })
}

export default function AdminIndex() {
    const { jobs, profiles } = useLoaderData<typeof loader>()
    const [job, setJob] = useState<Job | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const fetcher = useFetcher<typeof candidatesRankLoader>()

    useEffect(() => {
        if (job)
            fetcher.load(`/admin/resources/jobs/${job.id}/candidates-rank`)
    }, [job])

    return (
        <div className="h-full grid grid-rows-3 px-2 py-4">
            <div className="">
                <Tabs defaultValue="jobs">
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
                    <CardTitle></CardTitle>
                </CardHeader>
                <CardContent className="overflow-hidden">
                    {
                        fetcher.data && 
                        <AdminTable colNames={['Rank', 'Name', 'Email']} data={fetcher.data}/>
                    }
                </CardContent>
            </Card>
            <div>
                <Tabs defaultValue="job" className="h-full flex flex-col">
                    <TabsList className="w-fit my-4">
                        <TabsTrigger value="job">Job</TabsTrigger>
                        <TabsTrigger value="candidate">Candidate</TabsTrigger>
                    </TabsList>
                        <Card className={`bg-muted h-full overflow-hidden`}>
                            <CardContent className="h-full p-4">
                                <ScrollArea className="h-full">
                                    <TabsContent value="job">
                                        {job && <div className="innerHTML" dangerouslySetInnerHTML={{__html: job.description}}/>}
                                    </ TabsContent>
                                    <TabsContent value='candidate'>
                                        {profile && <div className="innerHTML" dangerouslySetInnerHTML={{__html: marked(profile.resume!)}}/>}
                                    </TabsContent>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    <TabsContent value="candidate">
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}