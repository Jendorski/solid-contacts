export const isEmpty = (value: unknown) => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value === "" && value.trim().length === 0) ||
    value === "undefined" ||
    value === "null"
  );
};
