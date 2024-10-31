import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Main from './Main';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-8 max-w-md bg-white shadow-lg rounded-lg mt-10">
        <h2 className="text-xl font-semibold mb-4">Đăng nhập</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          onClick={handleLogin}
          className="w-full p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Đăng nhập
        </button>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-8 max-w-4xl bg-white shadow-lg rounded-lg mt-10">
      <Main/>
    </div>
  );
}

export default App;