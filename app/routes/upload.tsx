import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { authenticator } from "./.server/auth"
import axios, { AxiosError } from "axios"
import { CVUploadResponse } from "./.server/dtos"
import { FLASK_API_URL } from "./.server/constants"
import { prisma } from "./.server/prisma"
import { json } from "@remix-run/react"

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