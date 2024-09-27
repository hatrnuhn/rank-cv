import { Static, Type } from "@sinclair/typebox";

export const Profile = Type.Object({
    id: Type.String(),
    email: Type.String(),
    name: Type.String(),
    image: Type.Union([
        Type.String(),
        Type.Null()
    ]),
    resume: Type.Union([
        Type.String(),
        Type.Null()
    ])
})

export type Profile = Static<typeof Profile>

export type OutletContext = {
    user: Profile | null
}

export const Admin = Type.Object({
    id: Type.String(),
    username: Type.String(),
    password: Type.String()
})

export type Admin = Static<typeof Admin>