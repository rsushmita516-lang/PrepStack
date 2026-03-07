import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

// The context will hold the current Firebase user and our backend user record
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // get ID token to call backend
        const token = await user.getIdToken();
        localStorage.setItem('firebaseToken', token); // Store token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // hit our verify route to create/get user document
        const res = await axios.get('/api/auth/verify');
        setBackendUser(res.data);
      } else {
        setBackendUser(null);
        localStorage.removeItem('firebaseToken'); // Remove token
        delete axios.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, backendUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
