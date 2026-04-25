import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function OAuthCallback() {
  const { handleGoogleLogin } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user = params.get('user');

    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        handleGoogleLogin(token, userData);
      } catch (err) {
        window.location.href = '/?error=oauth_failed';
      }
    } else {
      window.location.href = '/?error=oauth_failed';
    }
  }, [handleGoogleLogin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
        <h2 className="text-white text-xl font-semibold">Completing login...</h2>
        <p className="text-indigo-200 mt-2">Please wait while we sign you in.</p>
      </div>
    </div>
  );
}
