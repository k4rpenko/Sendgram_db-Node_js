"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../../../styles/LR.module.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdd = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  
    const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    if (email.length === 0) {
      setError(true);
      setErrorMessage("Email cannot be empty");
      return; 
    }

    if (!emailRegex.test(email)) {
      setError(true);
      setErrorMessage("Invalid email format");
      return;
    }
  
    if (password.length < 7) {
      setError(true);
      setErrorMessage("This password must be more than 7 characters long");
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/Login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (res.ok) {
        const data = await res.json();
        var refreshToken = data.refreshToken
        var userPreferences = data.userPreferences
        const ress = await fetch('api/creatCookie', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken, userPreferences }),
        });
        setError(false);
        setErrorMessage("");
        window.location.href = '/home';
      } else if (res.status === 404) {
        setError(true);
        setErrorMessage("There is no account at the specified email address. You can Sign up account at this email address");
      } else if (res.status === 401) {
        setError(true);
        setErrorMessage("Invalid credentials");
      } else {
        console.error('Unexpected error while getting data:', res.status);
        setError(true);
        setErrorMessage("Unexpected error occurred");
      }
    } catch (error) {
      console.error('Error during data retrieval:', error);
      setError(true);
      setErrorMessage("An error occurred");
    } 
  };
  

  return (
    <div>
      <div className={styles.block}>
        <div className={styles.Authorization}>
          <div className={styles.about}>
            <h3>Sign in</h3>
            <p>
              Log in to your account with your email and password
            </p>
          </div>
          <form onSubmit={handleAdd} className={styles.FormRegis}>
            <input type="email" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
            <input type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password}/>
            <div className={styles.ErrorRegister}>
              {Error && <span>{errorMessage}</span>}
            </div>
            <button type="submit">Sign in</button>
          </form>
        </div>
      </div>
    </div>
  );
}

