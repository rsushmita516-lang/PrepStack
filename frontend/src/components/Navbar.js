import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = () => {
  const { firebaseUser, backendUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav>
      <div>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/problems">Problems</Link>
        <Link to="/articles">Articles</Link>
      </div>
      <div>
        {firebaseUser ? (
          <>
            <span>Welcome, {backendUser?.displayName || firebaseUser.email}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;