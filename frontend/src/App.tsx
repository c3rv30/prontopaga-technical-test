import { useState } from 'react';
import { LoginView } from './components/LoginView';
import { ScoreView } from './components/ScoreView';
import { clearToken, getSession, type Session } from './session';

function App() {
  const [session, setSession] = useState<Session | null>(getSession);
  const [notice, setNotice] = useState<string>();

  function endSession(message?: string) {
    clearToken();
    setSession(null);
    setNotice(message);
  }

  function handleLogin(newSession: Session) {
    setNotice(undefined);
    setSession(newSession);
  }

  return (
    <main>
      <h1>Financial Risk Score</h1>
      {session ? (
        <ScoreView
          session={session}
          onLogout={() => endSession()}
          onSessionExpired={() =>
            endSession('Your session has expired, please sign in again')
          }
        />
      ) : (
        <LoginView onLogin={handleLogin} notice={notice} />
      )}
    </main>
  );
}

export default App;
