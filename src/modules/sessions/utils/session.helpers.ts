import {
  AUTO_RELEASE_AFTER_BILL_MINUTES,
  SESSION_DURATION_MINUTES,
} from "./session.constants";

export function getSessionExpiry(date = new Date()) {
  return new Date(
    date.getTime() +
      SESSION_DURATION_MINUTES * 60 * 1000
  );
}

export function getAutoReleaseTime(date = new Date()) {
  return new Date(
    date.getTime() +
      AUTO_RELEASE_AFTER_BILL_MINUTES * 60 * 1000
  );
}

export function isSessionExpired(
  expiresAt: string | Date
) {
  return (
    new Date(expiresAt).getTime() <= Date.now()
  );
}