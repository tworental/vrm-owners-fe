// eslint-disable-next-line import/prefer-default-export
export const setTimeToDate = (momentDate, HHMMtime) => {
  const [hh, mm] = HHMMtime.split(':');

  return momentDate.clone().set('hour', Number(hh)).set('minute', Number(mm));
};
