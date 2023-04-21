import { safeEncodeData, sendRequest } from '@/utils/request';

// eslint-disable-next-line import/prefer-default-export
export const list = (query) => sendRequest(
  ['reports', safeEncodeData(query)].join('?'),
);
