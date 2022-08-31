export const remove_backslash_characters = (str) => {
  return str
    ?.replace("\r", "\\r")
    .replace("\n", "\\n")
    .replace("\t", "\\t")
    .split(/\\/)[0];
};

export function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
