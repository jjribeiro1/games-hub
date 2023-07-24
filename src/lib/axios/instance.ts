import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_RESOURCE_BASEURL;

const rapidApiKey = process.env.NEXT_PUBLIC_RAPID_API_KEY;
const rapidApiHostValue = process.env.NEXT_PUBLIC_RAPID_API_HOST_VALUE;

const headers = {
  'X-RapidAPI-Key': rapidApiKey,
  'X-RapidAPI-Host': rapidApiHostValue,
};

export const axiosInstance = axios.create({ baseURL, headers });
