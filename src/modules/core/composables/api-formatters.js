export default function useApiFormatters() {
  const errorFormatter = (data) => {
    const errors = Object.entries(data.errors || {}).reduce((acc, [name, err]) => ({
      ...acc, [name]: Array.isArray(err) ? err[0] : err,
    }), {});

    const message = data.status < 500 ? data.message : 'Something went wrong, please try again in a few minutes.';

    return { message, errors, code: data.code };
  };

  return { errorFormatter };
}
