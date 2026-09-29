import { useState } from 'react';
import { LoginView } from './components/LoginView';
import { getSession, type Session } from './session';

function App() {
  const [session, setSession] = useState<Session | null>(getSession);

  return (
    <main>
      <h1>Financial Risk Score</h1>
      {session ? (
        <p>Signed in as {session.role}</p>
      ) : (
        <LoginView onLogin={setSession} />
      )}
    </main>
  );
}

export default App;
