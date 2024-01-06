import type { UserCredential } from "firebase/auth";

export interface AuthMethodProps {
  isAgreementAccepted: boolean;
}

export interface EventSignedIn {
  userCredential: UserCredential;
}

export interface EventSignedInError {
  error: string;
}

export interface EventSigningInProcess {
  value: boolean;
}
