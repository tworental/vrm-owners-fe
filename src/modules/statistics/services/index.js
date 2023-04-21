import { sendRequest } from '@/utils/request';

// eslint-disable-next-line import/prefer-default-export
export const getStatistics = (year) => sendRequest(`statistics/overview?year=${year}`);
