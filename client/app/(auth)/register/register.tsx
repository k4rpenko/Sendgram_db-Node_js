"use client"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from "../../../styles/LR.module.css"

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState(false);
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
      setErrorMessage("Password must be at least 7 characters long");
      return;
    }

    if (password !== password2) {
      setError(true);
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/Regists', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok || res.status === 200) {
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
        window.location.href = '/home';
      } else if (res.status === 401) {
        setError(true);
        setErrorMessage("This email address is already in use, please try another one or log in.");
      } else {
        console.error('Unexpected error while getting data:', res.status);
        setError(true);
        setErrorMessage("Unexpected error occurred, please try again later.");
      }
    } catch (error) {
      console.error('Error during data retrieval:', error);
      setError(true);
      setErrorMessage("An error occurred, please try again later.");
    }
  };



  return (
    <div>
      <div className={styles.block}>
        <div className={styles.Authorization}>
          <div className={styles.about}>
            
            <h3>Sign Up</h3>
            <p>
              Create an account with your email and password
            </p>
          </div>
          <form onSubmit={handleAdd} className={styles.FormRegis}>
            <input type="email" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
            <input type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password}/>
            <input type="password" name="password2" placeholder="Password" onChange={(e) => setPassword2(e.target.value)} value={password2}/>
            <div className={styles.ErrorRegister}>
              {error && <span>{errorMessage}</span>}
            </div>
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );

}
