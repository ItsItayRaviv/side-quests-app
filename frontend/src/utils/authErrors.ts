export const authErrMsg: Record<string, string> = {
  'auth/email-already-in-use':     'כבר קיימת משתמשת עם האימייל הזה',
  'auth/invalid-email':            'האימייל לא תקין',
  'auth/weak-password':            'הסיסמה חלשה—לפחות 6 תווים',
  'auth/wrong-password':           'סיסמה שגויה',
  'auth/user-not-found':           'לא נמצא משתמש',
} as const satisfies Record<string, string>;
