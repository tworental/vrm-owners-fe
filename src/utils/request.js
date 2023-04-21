import { serialize } from 'object-to-formdata';

const API_URI = process.env.VUE_APP_API_URI;

const getHaders = (headerName) => {
  const subdomain = window.location.host.split('.')[1]
    ? window.location.host.split('.')[0]
    : '';

  const headers = {
    'X-Org-Id': process.env.VUE_APP_ORGANIZATION_ID ? process.env.VUE_APP_ORGANIZATION_ID : subdomain,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const authenticateCookie = document.cookie.match(new RegExp('(^| )ownerAccessToken=([^;]+)'));

  if (authenticateCookie) {
    headers.Authorization = `Bearer ${authenticateCookie[2]}`;
  }

  return headerName ? headers[headerName] : headers;
};

const getApiUrl = (path) => [API_URI, path].join('/');

const mapData = (data) => ((typeof data === 'boolean') ? Number(data) : data);

const mapFormData = (data) => serialize(data, { nullsAsUndefineds: true });

const safeEncodeData = (data) => Object.entries(data)
  .map(([key, value]) => [encodeURIComponent(key), encodeURIComponent(mapData(value))].join('='))
  .join('&');

const safeEncodeJsonBody = (data, attr) => {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    return Object.entries(data).reduce((acc, [key, value]) => ({
      ...acc, ...safeEncodeJsonBody(mapData(value), attr ? `${attr}[${key}]` : key),
    }), {});
  }
  return { [attr]: mapData(data) };
};

const sendResponse = async (response) => {
  let results = { data: undefined, error: undefined };

  try {
    switch (response.headers.get('content-type')) {
      case 'application/zip':
        return await response.blob();

      default:
        results = await response.json();
    }
  // eslint-disable-next-line no-empty
  } catch (err) {}

  if (!response.ok) {
    // eslint-disable-next-line no-throw-literal
    throw ({ status: response.status, ...results.error });
  }
  return results;
};

const sendRequest = (path, method = 'GET', data = null, additionalHeaders = {}) => {
  const headers = {
    ...getHaders(),
    ...additionalHeaders,
  };

  let body;

  if (data) {
    if (data instanceof FormData) {
      body = data;
      delete headers['Content-Type'];
    } else {
      body = safeEncodeData(
        safeEncodeJsonBody(data),
      );
    }
  }

  return fetch(getApiUrl(path), { body, headers, method })
    .then(sendResponse);
};

export {
  sendRequest,
  safeEncodeData,
  getHaders,
  getApiUrl,
  mapFormData,
};
