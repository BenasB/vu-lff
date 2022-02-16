import axios, { AxiosError } from "axios";
import { FormValues } from "./GitHubUrlForm";

export interface ResponseData{
    success: boolean;
    requests?: {
        remaining: number;
        limit: number;
        reset: Date;
    };
    data?: any;
}

const getRepoData: (values: FormValues) => Promise<ResponseData> = async (values) => {
    let response
    try {
        response = await axios.get(`https://blog.spectrocoin.com/wp-json/wp/v2/posts`);
    } catch (error) {
        return {
            success: false,
        };
    }

    console.log(response);

    return {
        success: true,
        requests: {
            remaining: parseInt(response.headers['x-ratelimit-remaining']),
            limit: parseInt(response.headers['x-ratelimit-limit']),
            reset: new Date(parseInt(response.headers['x-ratelimit-reset']) * 1000),
        },
        data: response.data
    };
}

export default getRepoData;