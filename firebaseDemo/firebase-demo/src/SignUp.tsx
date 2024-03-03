import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { firebaseAuth } from './firebaseConfig';


const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(''); // Reset the error message on new submission

        try {
            const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            const user = userCredential.user;
            console.log(user);
            console.log(user.uid);  /// !!!IMPORTANT!!!
            alert('Signup successful!'); // Proceed with further actions here, like redirecting to a different page
        } catch (error: any) {
            setError(error.message); // Display any errors encountered during signup
        }
    };

    return (
        <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
    );
};

export default Signup;