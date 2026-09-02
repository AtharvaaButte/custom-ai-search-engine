export function cleanText(text, titleToStrip = '') {
  if (!text) return '';

  let processedText = text.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '');
  const parser = new DOMParser();
  const decoded = parser.parseFromString(processedText, 'text/html').body.textContent || processedText;

  let cleaned = decoded.trim();

  if (titleToStrip) {
    const decodedTitle = parser.parseFromString(titleToStrip, 'text/html').body.textContent || titleToStrip;
    if (cleaned.startsWith(decodedTitle.trim())) {
      cleaned = cleaned.slice(decodedTitle.trim().length).replace(/^[\n\r]+/, '').trim();
    }
  }

  return cleaned;
}