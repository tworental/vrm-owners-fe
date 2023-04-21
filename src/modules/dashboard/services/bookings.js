import { safeEncodeData, sendRequest } from '@/utils/request';

export const list = (unitId, params) => sendRequest([`units/${unitId}/bookings`, safeEncodeData(params)].join('?'));

export const checkAvailability = (unitId, params) => sendRequest([`units/${unitId}/bookings/availability`, safeEncodeData(params)].join('?'));

export const create = (unitId, body) => sendRequest(`units/${unitId}/bookings`, 'POST', body);
