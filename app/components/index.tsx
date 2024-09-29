import { Form, Link, useFetcher } from "@remix-run/react"
import { Job, Profile, isArrayOfSchema } from "../types"
import { FC, useCallback, useEffect, useState } from "react"
import { Button } from "./ui/button"
import { useRootIndexContext } from "~/routes/.client/hooks"
import { action as uploadAction } from "~/routes/upload"
import { Input } from "./ui/input"

export const DefaultProfileImage = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-person-fill rounded-full p-1" viewBox="0 0 16 16">
        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
    </svg>
)

export const GoogleLoginButton = ({ content }: { content?: string }) => (
    <Form method="post" action="/auth/google" className="group">
        <Button className="flex items-center px-3 py-1 rounded-full shadow-lg bg-muted text-sm" variant={'ghost'}>
            {content ? content : "Login with Google"}
            <span className="box w-10 h-10 flex items-center">
                <GoogleIcon />
            </span>
        </Button>
    </Form>
)

export const LogoutButton = () => (
    <Form method="post" action="/logout">
        <Button className="bg-muted px-2 py-1 rounded-full" variant={"ghost"}>Logout</Button>
    </Form>
)

export const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="#f9e65c" d="M84.467,44H50v13h20.856C67.931,65.717,59.702,72,50,72c-12.15,0-22-9.85-22-22s9.85-22,22-22	c4.799,0,9.235,1.541,12.851,4.149l9.269-9.269C66.091,17.956,58.391,15,50,15c-19.33,0-35,15.67-35,35s15.67,35,35,35	s35-15.67,35-35C85,47.952,84.806,45.951,84.467,44z"/><path fill="#78a2d2" d="M50,57h20.856c-1.577,4.699-4.704,8.679-8.763,11.36l9.87,8.884C79.911,70.828,85,61.01,85,50	c0-2.048-0.194-4.049-0.533-6H50V57z"/><path fill="#60be92" d="M62.093,68.36C58.622,70.653,54.472,72,50,72c-8.997,0-16.727-5.403-20.137-13.139L18.818,65.89	C24.609,77.23,36.393,85,50,85c8.32,0,15.957-2.908,21.963-7.756L62.093,68.36z"/><path fill="#f15b6c" d="M29.677,41.569C32.985,33.603,40.837,28,50,28c4.799,0,9.235,1.541,12.851,4.149l9.269-9.269	C66.091,17.956,58.391,15,50,15c-13.772,0-25.681,7.958-31.394,19.524L29.677,41.569z"/><path fill="#1f212b" d="M50,86c-19.851,0-36-16.149-36-36s16.149-36,36-36c8.271,0,16.353,2.878,22.753,8.105	c0.219,0.179,0.352,0.442,0.366,0.724c0.014,0.282-0.092,0.558-0.292,0.757l-9.269,9.269c-0.347,0.347-0.895,0.391-1.292,0.104	C58.675,30.369,54.433,29,50,29c-11.579,0-21,9.42-21,21s9.421,21,21,21c8.563,0,16.196-5.168,19.417-13H50c-0.553,0-1-0.448-1-1V44	c0-0.552,0.447-1,1-1h34.467c0.486,0,0.902,0.35,0.985,0.829C85.815,45.922,86,47.999,86,50C86,69.851,69.851,86,50,86z M50,16	c-18.748,0-34,15.252-34,34s15.252,34,34,34s34-15.252,34-34c0-1.624-0.129-3.302-0.384-5H51v11h19.856	c0.322,0,0.624,0.155,0.812,0.416c0.188,0.261,0.239,0.597,0.137,0.902C68.657,66.698,59.895,73,50,73c-12.683,0-23-10.318-23-23	s10.317-23,23-23c4.569,0,8.954,1.329,12.735,3.851l7.883-7.883C64.72,18.467,57.442,16,50,16z"/><path fill="#1f212b" d="M71.5,78c-0.119,0-0.239-0.042-0.335-0.128l-4-3.6c-0.205-0.185-0.222-0.501-0.037-0.706	c0.187-0.205,0.502-0.221,0.707-0.037l4,3.6c0.205,0.185,0.222,0.501,0.037,0.706C71.772,77.944,71.637,78,71.5,78z"/><path fill="#1f212b" d="M65.5,72.6c-0.119,0-0.239-0.042-0.335-0.128l-1.777-1.6c-0.205-0.185-0.222-0.501-0.037-0.706	c0.187-0.205,0.502-0.221,0.707-0.037l1.777,1.6c0.205,0.185,0.222,0.501,0.037,0.706C65.772,72.544,65.637,72.6,65.5,72.6z"/><path fill="#1f212b" d="M27.929,60c-0.165,0-0.326-0.082-0.422-0.231c-0.148-0.233-0.079-0.542,0.153-0.69l1.571-1	c0.231-0.146,0.541-0.08,0.69,0.153c0.148,0.233,0.079,0.542-0.153,0.69l-1.571,1C28.114,59.975,28.021,60,27.929,60z"/><path fill="#1f212b" d="M23.5,62.818c-0.165,0-0.326-0.082-0.422-0.231c-0.148-0.233-0.079-0.542,0.153-0.69l2-1.273	c0.231-0.146,0.541-0.081,0.69,0.153c0.148,0.233,0.079,0.542-0.153,0.69l-2,1.273C23.686,62.793,23.593,62.818,23.5,62.818z"/><path fill="#1f212b" d="M18.5,66c-0.165,0-0.326-0.082-0.422-0.231c-0.148-0.233-0.079-0.542,0.153-0.69l3-1.909	c0.23-0.146,0.541-0.08,0.69,0.153c0.148,0.233,0.079,0.542-0.153,0.69l-3,1.909C18.686,65.975,18.593,66,18.5,66z"/><path fill="#1f212b" d="M24.5,38.182c-0.093,0-0.186-0.025-0.269-0.078l-5-3.182c-0.232-0.148-0.302-0.458-0.153-0.69	c0.149-0.233,0.46-0.299,0.69-0.153l5,3.182c0.232,0.148,0.302,0.458,0.153,0.69C24.826,38.1,24.665,38.182,24.5,38.182z"/><path fill="#1f212b" d="M27.5,40.091c-0.093,0-0.186-0.025-0.269-0.078l-1-0.636c-0.232-0.148-0.302-0.458-0.153-0.69	c0.15-0.233,0.46-0.299,0.69-0.153l1,0.636c0.232,0.148,0.302,0.458,0.153,0.69C27.826,40.009,27.665,40.091,27.5,40.091z"/></svg>
)

export const ProfileSettings = ({ user }: { user: Profile }) => {

    return (
        <div className="group relative bg-muted shadow-lg px-2 py-1 rounded-full" tabIndex={1}>
            <p className="flex items-center gap-2 text-sm ps-4">
                <span className="truncate">
                    Hi, {user.name}
                </span>
                <span className="rounded-full max-h-10 max-w-10 overflow-hidden">
                {
                    user.image ? 
                    <img src={user.image} alt="Profile image"/> :
                    <DefaultProfileImage />
                }
                </span>
            </p>
            <ul className="absolute scale-y-0 right-0 -bottom-10 group-hover:scale-y-100 group-focus-within:scale-y-100 transition-all duration-300 ease-in-out delay-150 origin-top">
                <li>
                    <LogoutButton />
                </li>
            </ul>
        </div>
    )
}

export const ReloadButton = ({ className, resetFn }: { className?: string, resetFn: () => void }) => {
    return (
        <button className={className} type="button" onClick={() => resetFn()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
            </svg>
        </button>
    )
}

export const GitHubIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
</svg>

export const Footer = () => {
    return (
        <div className="flex justify-center text-sm py-2">
            <p className="flex items-center gap-1">
                Visit on GitHub 
                <Link className="w-4 h-4 hover:scale-125 focus-visible:scale-125 transition-all ease-out delay-150 duration-200" to={'https://github.com'} target="_blank">
                    <GitHubIcon />
                </Link>
            </p>
        </div>
    )
}

type JobItemProps = {
    job: Job
}

const JobItem: FC<JobItemProps> = ({ job }) => {
    const { setIsJobDescShown, isJobDescShown, shownJob, setShownJob } = useRootIndexContext()

    const onClick = useCallback(() => {
        setShownJob(job)
        setIsJobDescShown(job.id === shownJob?.id ? !isJobDescShown : true)
    }, [setIsJobDescShown, setShownJob, isJobDescShown, job.id, shownJob])

    return (
        <li className={`${isJobDescShown && shownJob?.id === job.id ? 'bg-background shadow-lg' : ''} rounded`}>
            <h1>
                <Button variant="ghost" className={`w-full flex justify-start rounded`} onClick={() => onClick()}>
                    {job.title}
                </Button>
            </h1>
        </li>
    )
}

type JobListProps = {
    jobs: Job[]
}

export const JobsList: FC<JobListProps> = ({ jobs }) => {
    return (
        <>
            <h3>
                Vacant Positions
            </h3>
            {
                jobs.length === 0 ? 
                <p>
                    No current vacant jobs
                </p> :
                <ul className="mt-4 flex flex-col gap-1">
                    {isArrayOfSchema(Job, jobs) && 
                        jobs.map(j => 
                        <>
                            <JobItem key={j.id} job={j} />
                        </>
                    )}
                </ul>
            }
        </>
    )   
}

export const UploadForm = () => {
    const fetcher = useFetcher<typeof uploadAction>()
    const [data, setData] = useState(fetcher.data)

    useEffect(() => {
        if (fetcher.state === 'idle')
            setData(fetcher.data)

    }, [fetcher.state])

    if (data && data.status < 400)
        return (
            <div className="flex items-center gap-1">
                <p>
                    Uploaded successfully. Upload again?
                </p>
                <ReloadButton className="w-4 h-4" resetFn={() => setData(undefined)}/>
            </div>
        )
    else if (fetcher.state === 'idle' && data && data.status > 399) {
        return (
            <div className="flex items-center gap-1">
                <p>Could not process your file</p>
                <ReloadButton className="h-4 w-4" resetFn={() => setData(undefined)}/>
            </div>
        )
    } else return (
        <fetcher.Form method="post" action="/upload" encType="multipart/form-data" className="bg-muted flex justify-center items-center rounded-full overflow-hidden shadow-lg max-w-96">
            <Input type="file" name="file" id="file" className="border-none"/>
            <Button className="py-1 px-2 rounded-none bg-muted hover:shadow-lg" variant={"ghost"}>Upload</Button>
            <div className="flex items-center gap-1">
                {
                    fetcher.state !== 'idle' && 
                    <>
                        <em>Submitting...</em>
                    </>
                }
            </div>
        </fetcher.Form>
    )
}
