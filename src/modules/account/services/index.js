import { mapFormData, sendRequest } from '@/utils/request';

export const getOwner = () => sendRequest('me');
export const updateOwner = (data) => sendRequest('me', 'PATCH', mapFormData(data));
