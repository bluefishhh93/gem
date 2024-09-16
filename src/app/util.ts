import sanitizeHtml from "sanitize-html";

export const AUTHENTICATION_ERROR_MESSAGE =
  "You must be logged in to view this content";

export const PRIVATE_GROUP_ERROR_MESSAGE =
  "You do not have permission to view this group";

export const AuthenticationError = class AuthenticationError extends Error {
  constructor() {
    super(AUTHENTICATION_ERROR_MESSAGE);
    this.name = "AuthenticationError";
  }
};

export const PrivateGroupAccessError = class PrivateGroupAccessError extends Error {
  constructor() {
    super(PRIVATE_GROUP_ERROR_MESSAGE);
    this.name = "PrivateGroupAccessError";
  }
};

export const NotFoundError = class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
};
export function sanitizeBlogContent(html: string): string {
  return sanitizeHtml(html);
}

export function stripHtmlTags(content: string): string {
  return content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}


export function createExcerpt(html: string, maxLength: number = 135): string {
  const cleanText = stripHtmlTags(html);

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  const lastSpace = cleanText.lastIndexOf(' ', maxLength);
  const cutoff = lastSpace > -1 ? lastSpace : maxLength;

  return `${cleanText.substring(0, cutoff)}...`;
}

export function calculateReadingTime(content: string): number {
  const plainText = stripHtmlTags(sanitizeBlogContent(content));
  const words = plainText.split(/\s+/).length;
  const wordsPerMinute = 200;

  return Math.ceil(words / wordsPerMinute);
}