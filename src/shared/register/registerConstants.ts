export const DEFAULT_USER_LIST_TITLE = 'User';
export const DEFAULT_BUSU_LIST_TITLE = 'BUSU';
export const DEFAULT_MARKETS_LIST_TITLE = 'Markets';
export const DEFAULT_BEST_DESCRIBE_LIST_TITLE = 'BestDescribe';

export const EMAIL_QUERY_PARAM = 'email';
export const MAX_EMAIL_LENGTH = 254;
export const MAX_TITLE_LENGTH = 255;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_EMAIL_LENGTH) {
    return false;
  }
  return EMAIL_PATTERN.test(trimmed);
}

export function clipTitle(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length <= MAX_TITLE_LENGTH) {
    return trimmed;
  }
  return trimmed.substring(0, MAX_TITLE_LENGTH);
}

export function shouldSkipRegisterPrompt(isEditMode?: boolean): boolean {
  if (isEditMode) {
    return true;
  }
  if (typeof window === 'undefined' || !window.location) {
    return true;
  }

  const path = window.location.pathname.toLowerCase();
  if (path.indexOf('workbench.aspx') >= 0) {
    return true;
  }

  const params = new URLSearchParams(window.location.search || '');
  const mode = (params.get('Mode') || params.get('mode') || '').toLowerCase();
  return mode === 'edit';
}

let localClaimed = false;

interface IGuardWindow extends Window {
  __AE_REGISTER_PROMPT__?: boolean;
}

export function claimRegisterPromptHost(): boolean {
  if (localClaimed) {
    return false;
  }
  if (typeof window !== 'undefined') {
    const w = window as IGuardWindow;
    if (w.__AE_REGISTER_PROMPT__) {
      return false;
    }
    w.__AE_REGISTER_PROMPT__ = true;
  }
  localClaimed = true;
  return true;
}

export function releaseRegisterPromptHost(): void {
  localClaimed = false;
  if (typeof window !== 'undefined') {
    delete (window as IGuardWindow).__AE_REGISTER_PROMPT__;
  }
}
