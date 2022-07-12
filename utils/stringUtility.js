export const remove_backslash_characters = (str) => {
  return str
    ?.replace("\r", "\\r")
    .replace("\n", "\\n")
    .replace("\t", "\\t")
    .split(/\\/)[0];
};
