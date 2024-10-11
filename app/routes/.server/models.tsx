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

export const getProfiles = async (filter: string | null = null, withResumeOnly: boolean = true) => {
    if (filter)
        return await prisma.profile.findMany({
            where: {
                AND: [
                    {
                        OR: ['name', 'email', 'id'].map(f => ({ [f]: { contains: filter, mode: 'insensitive' } })),
                    },
                    {
                        resume: {
                            not: withResumeOnly ? null : undefined
                        }
                    }
                ]
            }
        })

    return await prisma.profile.findMany({
        where: {
            resume: {
                not: withResumeOnly ? null : undefined
            }
        }
    })
}

export const getProfile = async (key: string) => {
    return await prisma.profile.findFirst({
        where: {
            OR: [
                {id: key},
                {email: key}
            ]
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