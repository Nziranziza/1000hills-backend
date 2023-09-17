export default function slugify(word: string, withTime?: boolean) {
  const slug = word.replace(/ /g, "-");
  if (!withTime) {
    return slug;
  }
  return `${slug}-${new Date().getTime()}`;
}
