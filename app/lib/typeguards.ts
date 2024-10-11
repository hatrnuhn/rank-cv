import { Admin, Job } from "@prisma/client";
import { ERROR_NO_FILE, ERROR_WRONG_FILE } from "./errors";
import { Static, TSchema } from "@sinclair/typebox";
import { TypeCompiler } from '@sinclair/typebox/compiler'

export const isNoFileError = (payload: unknown): payload is typeof ERROR_NO_FILE  => {
    return (
        typeof payload === 'string' &&
        payload === ERROR_NO_FILE
    )
}

export const isWrongFileError = (payload: unknown): payload is typeof ERROR_WRONG_FILE => {
    return (
        typeof payload === 'string' &&
        payload === ERROR_WRONG_FILE
    )
}

export const isAdmin = (payload: unknown): payload is Omit<Admin, 'id'> => {
    return (
        typeof payload === 'object' &&
        payload !== null &&
        'username' in payload &&
        'password' in payload &&
        typeof payload.username === 'string' &&
        typeof payload.password === 'string'
    )
}

export const isJob = (payload: unknown): payload is Job => {
    return (
        typeof payload === 'object' &&
        payload !== null &&
        'id' in payload &&
        'title' in payload &&
        'description' in payload &&
        typeof payload.id === 'string' &&
        typeof payload.title === 'string' &&
        typeof payload.description === 'string'
    )
}
