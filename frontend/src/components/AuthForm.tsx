import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase';
import { authErrMsg } from '../utils/authErrors';

type Mode = 'signin' | 'signup';

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>('signin');
  const toggle = () => setMode(m => (m === 'signin' ? 'signup' : 'signin'));
  const [error, setError] = useState<string>('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const pw    = (form.elements.namedItem('pw')    as HTMLInputElement).value;

    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, pw);
      } else {
        await signInWithEmailAndPassword(auth, email, pw);
      }
    } catch (err: any) {           // eslint-disable-line @typescript-eslint/no-explicit-any
      setError(authErrMsg[err.code] ?? 'שגיאה לא ידועה');
    }
  };

  const googleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err: any) {
      setError(authErrMsg[err.code] ?? 'שגיאה לא ידועה');
    }
  };

  return (
    <section className="auth-box">
      <h2>{mode === 'signup' ? 'הרשמה' : 'התחברות'}</h2>

      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="pw"    type="password" placeholder="Password" required />

        <button type="submit">
          {mode === 'signup' ? 'צור משתמש' : 'היכנס'}
        </button>
      </form>

      <button onClick={googleLogin}>Google</button>

      {error && <p className="error">{error}</p>}

      <small onClick={toggle} style={{ cursor: 'pointer' }}>
        {mode === 'signup' ? 'יש לך חשבון? התחבר' : 'אין לך חשבון? הירשם'}
      </small>
    </section>
  );
}
