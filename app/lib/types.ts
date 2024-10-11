import { Static, Type } from '@sinclair/typebox'

export const Score = Type.Object({
    candidateId: Type.String(),
    score: Type.Number()
})

export type Score = Static<typeof Score>

export const Job = Type.Object({
    id: Type.String(),
    title: Type.String(),
    description: Type.String()
})

export type Job = Static<typeof Job>

export const Profile = Type.Object({
    id: Type.String(),
    name: Type.String(),
    email: Type.String(),
    resume: Type.Union([Type.String(), Type.Null()]),
    image: Type.Union([Type.String(), Type.Null()])
})

export type Profile = Static<typeof Profile>