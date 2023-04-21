import { sendRequest } from '@/utils/request';

export const getLimits = () => sendRequest('limits');
export const getConfig = () => sendRequest('config');
