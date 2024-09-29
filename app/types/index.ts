import { Static, TSchema, Type, TypeGuard } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

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

export const Job = Type.Object({
    id: Type.String(),
    title: Type.String(),
    description: Type.String()
})

/**
 * Description is supposed to conform with Markdown rules to be rendered correctly
 */
export type Job = Static<typeof Job>

export const isOfSchema = (schema: TSchema , o: unknown): o is Static<typeof schema> => {
    const tCompiler = TypeCompiler.Compile(schema)
    return tCompiler.Check(o)
}

export const isArrayOfSchema = (schema: TSchema, a: unknown): a is Static<typeof schema>[] => {
    const tCompiler = TypeCompiler.Compile(schema)
    return Array.isArray(a) && a.every(o => tCompiler.Check(o))
}