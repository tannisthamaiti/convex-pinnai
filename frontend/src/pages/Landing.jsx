"use client";
import { useNavigate } from 'react-router-dom';
import {
  Authenticated,
  Unauthenticated,
} from "convex/react";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";


export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-16">
        <h1 className="text-4xl font-bold mb-6 text-center">Math that drills</h1>

        <SignedIn>
          <p className="text-lg mb-4">Welcome! You're signed in.</p>
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700"
          >
            Please fill more information ...
          </button>
        </SignedIn>

        <Unauthenticated>
          <div className="flex flex-col gap-4 w-80">
            <p className="text-center">Sign in or register to continue</p>
            <SignInButton mode="modal">
              <button className="bg-dark dark:bg-light text-light dark:text-dark text-sm px-4 py-2 rounded-md border-2">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-dark dark:bg-light text-light dark:text-dark text-sm px-4 py-2 rounded-md border-2">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </Unauthenticated>
      </main>
    </div>
  );
}