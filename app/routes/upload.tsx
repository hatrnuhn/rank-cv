import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { authenticator } from "./.server/auth"
import axios, { AxiosError } from "axios"
import { CVUploadResponse } from "./.server/dtos"
import { FLASK_API_URL } from "./.server/constants"
import { prisma } from "./.server/prisma"
import { json, useFetcher} from "@remix-run/react"
import { ReloadButton } from "./components"
import { useEffect, useState } from "react"
import { useFetcherWithReset } from "./.client/hooks"

export const action = async ({ request }: ActionFunctionArgs) => {
    try {
        const token = process.env.FLASK_API_TOKEN
        const user = await authenticator.isAuthenticated(request)

        if (!user)
            return json({ msg: "unauthenticated", status: 401 }, { status: 401 })
    
        const uploaded = await request.formData()
        
        const response = await axios.post<CVUploadResponse>(`${FLASK_API_URL}/cvs`, uploaded, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    
        await prisma.profile.update({
            where: {
                email: user.email
            },
            data: {
                resume: response.data.extracted_text
            }
        })

        return json({ msg: 'uploaded successfully', status: 201 }, { status: 201 })
    } catch (err) {
        console.error(err)
        if (err instanceof AxiosError && err.response?.status === 400)
            return json({ msg: 'invalid pdf file', status: 400 }, { status: 400 })
        else
            return json({ msg: 'could not process pdf', status: 500 }, { status: 500 })
    }
}

export const loader = async ({request}: LoaderFunctionArgs) => {
    return redirect('/')
}

export const UploadForm = () => {
    const fetcher = useFetcher<typeof action>()
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
        <fetcher.Form method="post" action="/upload" encType="multipart/form-data">
            <input type="file" name="file" id="file"/>
            <button className="bg-stone-300 dark:bg-stone-900 py-1 px-2 rounded-md hover:bg-stone-500 shadow">Upload</button>
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
