import {
  clipTitle,
  EMAIL_QUERY_PARAM,
  isValidEmail,
  MAX_EMAIL_LENGTH
} from './registerConstants';

export interface IRegisterIdentity {
  email: string;
  title: string;
  fromEmailQuery: boolean;
}

export function resolveRegisterIdentity(
  signedInEmail: string | undefined,
  signedInTitle: string | undefined,
  allowEmailQueryOverride: boolean,
  href?: string
): IRegisterIdentity | undefined {
  if (allowEmailQueryOverride) {
    const fromQuery = readEmailQueryParam(href);
    if (fromQuery) {
      return {
        email: fromQuery,
        title: clipTitle('BackDoor User (' + fromQuery + ')'),
        fromEmailQuery: true
      };
    }
  }

  const email = (signedInEmail || '').trim();
  if (!isValidEmail(email)) {
    return undefined;
  }

  const title = clipTitle((signedInTitle || '').trim() || email);
  return {
    email,
    title,
    fromEmailQuery: false
  };
}

function readEmailQueryParam(href?: string): string | undefined {
  let raw: string | null = null;
  if (href) {
    try {
      raw = new URL(href, 'https://local.invalid/').searchParams.get(EMAIL_QUERY_PARAM);
    } catch {
      raw = null;
    }
  } else if (typeof window !== 'undefined' && window.location) {
    raw = new URLSearchParams(window.location.search || '').get(EMAIL_QUERY_PARAM);
  }

  if (!raw) {
    return undefined;
  }
  const email = raw.trim();
  if (!email || email.length > MAX_EMAIL_LENGTH) {
    return undefined;
  }
  return email;
}
