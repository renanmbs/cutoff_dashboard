import './App.css';
import { Cutoff } from './cutoff/cutoff';
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import logo2 from "./image/Monarch Metal White Transparent.png";

function App() {
  const { isAuthenticated, isLoading, login } = useKindeAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          {/* Make sure logo2 is imported correctly in each project */}
          <img src={logo2} alt="Monarch Metal" className="auth-logo" />

          <div className="auth-hero">
            <h1 className="auth-title">Access Restricted</h1>
            <p className="auth-subtitle">
              Please sign in to access this Monarch Metal tool.
            </p>
          </div>

          <div className="auth-buttons">
            <button className="btn auth-primary" onClick={() => login()}>
              Sign in with Google
            </button>
          </div>

          <p className="auth-footnote">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    );
  }
  return (
    <div id='body'>
      <Cutoff />
    </div>
  );
}

export default App;
