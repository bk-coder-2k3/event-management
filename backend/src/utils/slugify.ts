export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word chars with -
    .replace(/^-+|-+$/g, ''); // Trim dashes from beginning/end
}
