/** Remove empty and undefined properties, returning a new copy. */
export const removeEmptyKeys = <T extends { [key: string]: any }>(obj: T): T =>
  Object.keys(obj)
    .filter((f) => obj[f] != null)
    .reduce(
      (r, i) =>
        typeof obj[i] === 'object'
          ? Object.keys(obj[i]).length === 0
            ? r
            : { ...r, [i]: removeEmpty(obj[i]) } // recurse.
          : typeof obj[i] === 'undefined' || obj[i] === ''
          ? r
          : { ...r, [i]: obj[i] },
      {} as T
    );

/** Remove empty properties by mutating the original object. */
export const removeEmpty = <T>(obj: { [key: string]: any }): T => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') {
      removeEmpty(obj[key]);
    } else if (obj[key] === '' || obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj as T;
};

export const stripSpaces = (s: string) => s.replace(/\s|,|\./g, '');

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
