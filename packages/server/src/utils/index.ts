/**
 * Create a GUID
 * @see https://stackoverflow.com/a/2117523/319711
 *
 * @returns RFC4122 version 4 compliant GUID
 */
export const uuid4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // tslint:disable-next-line:no-bitwise
    const r = (Math.random() * 16) | 0;
    // tslint:disable-next-line:no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/** Sort descending by updated date (when updated is not available, use created date) */
export const sortByDateDesc = (obj1: LokiObj, obj2: LokiObj) => {
  const time1 = obj1.meta.updated || obj1.meta.created;
  const time2 = obj2.meta.updated || obj2.meta.created;
  return time1 === time2 ? 0 : time1 > time2 ? -1 : 1;
};
