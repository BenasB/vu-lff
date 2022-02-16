import { Octokit } from '@octokit/core';
import { Endpoints } from '@octokit/types';
import { FormValues } from "./GitHubUrlForm";

export interface ResponseData{
    success: boolean;
    requests?: {
        remaining: number;
        limit: number;
        reset: Date;
    };
    data?: Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"];
}

const getRepoData: (values: FormValues) => Promise<ResponseData> = async (values) => {
    const octokit = new Octokit();
    const parts = values.url.split('/');
    let response;
    try {
        response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
            owner: parts[0],
            repo: parts[1]
        })
    } catch (error) {
        console.log("RADAU ERRORA", error)
        return {
            success: false,
        };
    }

    console.log(response);
    const remaining = response.headers['x-ratelimit-remaining'];
    const limit = response.headers['x-ratelimit-limit'];
    const reset = response.headers['x-ratelimit-reset'];

    return {
        success: true,
        requests: {
            remaining: remaining ? parseInt(remaining) : -1,
            limit: limit ? parseInt(limit) : -1,
            reset: reset ? new Date(parseInt(reset) * 1000) : new Date(0),
        },
        data: response.data
    };
}

export default getRepoData;