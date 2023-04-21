import { sendRequest, safeEncodeData, getHaders } from '@/utils/request';

export const signinRequest = (data) => sendRequest(
  'auth/signin', 'POST', data,
);

export const changePasswordRequest = (data, query) => sendRequest(
  ['auth/password/change', safeEncodeData(query)].join('?'), 'PATCH', data,
);

export const resetPasswordRequest = (data) => sendRequest(
  'auth/password/reset', 'POST', data,
);

export const confirmationRequest = (query) => sendRequest(
  ['auth/account/confirmation', safeEncodeData(query)].join('?'), 'PATCH',
);

export const validateRequest = (field, data) => sendRequest(
  `auth/validate?field=${field}`, 'POST', { identifier: getHaders('X-Org-Id'), ...data },
);

export const signoutRequest = () => Promise.resolve();
