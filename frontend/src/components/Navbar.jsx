import { useNavigate, useLocation } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton
} from "@clerk/clerk-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow">
      {/* Left: Logo */}
      <div className="flex items-center">
        <img
          src="/Logo.png"
          alt="PinnAI Logo"
          style={{ height: '40px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
      </div>

      {/* Right: Nav links + Profile */}
      <div className="flex items-center gap-6">
        <button
          className={`text-sm font-medium hover:text-blue-600 ${
            location.pathname === '/' ? 'text-blue-600 underline' : ''
          }`}
          onClick={() => navigate('/')}
        >
          Home
        </button>
        <button
          className={`text-sm font-medium hover:text-blue-600 ${
            location.pathname === '/dashboard' ? 'text-blue-600 underline' : ''
          }`}
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </button>

        {/* Auth controls */}
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
      </div>
    </nav>
  );
}
