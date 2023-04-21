import { sendRequest } from '@/utils/request';

export const list = () => sendRequest('units');

export const show = (id) => sendRequest(`units/${id}`);
