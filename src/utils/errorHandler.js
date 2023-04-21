export default function errorHandler(err) {
  switch (err.status) {
    case 401:
      return '/auth/signout';
    case 403:
      return '/errors/403';
    case 404:
      return '/errors/404';
    default:
      if (err.message === 'Failed to fetch') {
        return '/errors/502';
      }
      return '/errors/500';
  }
}
