import {
  type User,
  onAuthStateChanged,
  type Unsubscribe,
} from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase';

/** When user is still loading we keep it as `undefined`. */
export type MaybeUser = User | null | undefined;

export const AuthCtx = createContext<MaybeUser>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MaybeUser>(undefined);

  useEffect(() => {
    const unsub: Unsubscribe = onAuthStateChanged(auth, setUser);
    return unsub;               // cleanup on unmount
  }, []);

  return <AuthCtx.Provider value={user}>{children}</AuthCtx.Provider>;
};
