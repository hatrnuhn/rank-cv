import { Job, Profile } from "@prisma/client"
import { prisma } from "./prisma"

export const getJobs = async (filter: string | null = null) => {
    return await prisma.job.findMany( filter ?
        {
            where: {
                OR: ['title', 'description', 'id'].map(f => ({ [f]: { contains: filter, mode: 'insensitive' } }))
            }
        } : undefined
    )
}

export const getJob = async (id: string) => {
    return await prisma.job.findUnique({
        where: {
            id
        }
    })
}

export const updateJob = async ({id, description, title}: Job) => {
    return await prisma.job.update({
        where: {
            id
        },
        data: {
            description,
            title
        }
    })
}

export const deleteJob = async (id: string) => {
    await prisma.job.delete({
        where: {
            id
        }
    })
}

export const updateProfile = async ({ id, email, image, name, resume }: Profile) => {
    await prisma.profile.update({
        where: {
            id
        },
        data: {
            email,
            image,
            name,
            resume
        }
    })
}