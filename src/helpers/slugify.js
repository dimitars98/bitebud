// export default function slugify(text) {
//   return text
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, "-") // spaces → dashes
//     .replace(/[^\w-]+/g, ""); // remove non-alphanumeric
// }

export default function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}
