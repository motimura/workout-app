import React, { useState } from 'react';
import { signUp, confirmSignUp, signIn } from '../api/cognito';

const Auth = ({ onLogin }) => {
  const [mode, setMode] = useState('login'); // login, signup, confirm
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signUp(email, password);
      setMode('confirm');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await confirmSignUp(email, code);
      setMode('login');
      setError('登録完了！ログインしてください');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h1>💪 ワークアウト記録</h1>

      {mode === 'login' && (
        <form onSubmit={handleLogin} className="auth-form">
          <h2>ログイン</h2>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="パスワード（8文字以上）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
          <p className="switch-mode">
            アカウントがない場合は
            <span onClick={() => setMode('signup')}>新規登録</span>
          </p>
        </form>
      )}

      {mode === 'signup' && (
        <form onSubmit={handleSignUp} className="auth-form">
          <h2>新規登録</h2>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="パスワード（8文字以上、英小文字・数字含む）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? '送信中...' : '登録'}
          </button>
          <p className="switch-mode">
            アカウントがある場合は
            <span onClick={() => setMode('login')}>ログイン</span>
          </p>
        </form>
      )}

      {mode === 'confirm' && (
        <form onSubmit={handleConfirm} className="auth-form">
          <h2>確認コード入力</h2>
          <p className="confirm-message">
            {email} に確認コードを送信しました
          </p>
          <input
            type="text"
            placeholder="確認コード"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? '確認中...' : '確認'}
          </button>
        </form>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Auth;