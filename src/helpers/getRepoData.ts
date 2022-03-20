import { Octokit } from '@octokit/core';
import { Endpoints } from '@octokit/types';
import { FormValues } from "../components/GitHubUrlForm";

export interface ResponseData{
  startingUrl: string;
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
      repo: parts[1],
      per_page: 100,
      since: values.since ? new Date(values.since).toISOString() : undefined
    });
  } catch (error) {
    return {
      success: false,
      startingUrl: values.url
    };
  }
  
  const remaining = response.headers['x-ratelimit-remaining'];
  const limit = response.headers['x-ratelimit-limit'];
  const reset = response.headers['x-ratelimit-reset'];
  
  return {
    success: true,
    startingUrl: values.url,
    requests: {
      remaining: remaining ? parseInt(remaining) : -1,
      limit: limit ? parseInt(limit) : -1,
      reset: reset ? new Date(parseInt(reset) * 1000) : new Date(0),
    },
    data: response.data
  };
}

export default getRepoData;