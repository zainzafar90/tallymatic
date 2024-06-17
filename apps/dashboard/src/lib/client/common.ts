import { stringify } from "qs";
import { apiUrl } from "../../utils/common.utils";


const commonHeaders = {
    'Content-Type': 'application/json',
    Accept: "application/json",
}

const getUrl = (path: string, query?: Record<string, any>) => {
    const params = query ? stringify(query) : null

    return `${apiUrl}${path}${params ? `?${params}` : ""}`
}


const getBody = (payload?: Record<string, any>) => {
    return payload ? JSON.stringify(payload) : undefined
}

function getOptions(
    options?: Omit<RequestInit, "body">,
    payload?: Record<string, any>
): RequestInit {
    const body = getBody(payload)

    return {
        ...options,
        headers: {
            ...commonHeaders,
            ...options?.headers,
        },
        body,
        credentials: "include",
    }
}

async function makeRequest<
    TRes,
    TPayload extends Record<string, any> | undefined,
    TQuery extends Record<string, any> | undefined = undefined,
>(
    path: string,
    payload?: TPayload,
    query?: TQuery,
    options?: Omit<RequestInit, "body">
): Promise<TRes> {
    const url = getUrl(path, query)
    const requestOptions = getOptions(options, payload)

    const response = await fetch(url, requestOptions)

    if (!response.ok) {
        const errorData = await response.json()

        // Temp: Add a better error type
        throw new Error(`API error ${response.status}: ${errorData.message}`)
    }

    return response.json()
}

export async function getRequest<
    TRes,
    // eslint-disable-next-line @typescript-eslint/ban-types
    TQuery extends Record<string, any> | undefined = {},
>(
    path: string,
    query?: TQuery,
    options?: Omit<RequestInit, "body" | "method">
): Promise<TRes> {
    return makeRequest<TRes, undefined, Record<string, any>>(
        path,
        undefined,
        query,
        {
            ...options,
            method: "GET",
        }
    )
}

export async function postRequest<
    TRes,
    // eslint-disable-next-line @typescript-eslint/ban-types
    TPayload extends Record<string, any> | undefined = {},
>(
    path: string,
    payload?: TPayload,
    options?: Omit<RequestInit, "body" | "method">
): Promise<TRes> {
    return makeRequest<TRes, Record<string, any>, undefined>(
        path,
        payload,
        undefined,
        {
            ...options,
            method: "POST",
        }
    )
}

export async function deleteRequest<TRes>(
    path: string,
    options?: Omit<RequestInit, "body" | "method">
): Promise<TRes> {
    return makeRequest<TRes, undefined, undefined>(path, undefined, undefined, {
        ...options,
        method: "DELETE",
    })
}
