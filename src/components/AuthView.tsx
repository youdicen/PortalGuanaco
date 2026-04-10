import React, { useState } from 'react';
import { apiFetch } from '../lib/api';
import { Loader2, Key, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

export const AuthView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+503');
  const [otpCode, setOtpCode] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (!showOtp && !isForgotPassword && !recaptchaToken) {
        setMessage({ type: 'error', text: 'Por favor completa el captcha para continuar.' });
        setIsLoading(false);
        return;
      }

      if (showOtp) {
        const data = await apiFetch('/auth.php?action=verify', {
          method: 'POST',
          body: JSON.stringify({ email, code: otpCode })
        });
        localStorage.setItem('token', data.token);
        navigate('/submit');
        return;
      }

      if (isForgotPassword) {
        setMessage({ type: 'error', text: 'Por favor contacta al administrador para recuperar tu cuenta.' });
      } else if (isSignUp) {
        await apiFetch('/auth.php?action=register', {
          method: 'POST',
          body: JSON.stringify({ email, password, phone_number: `${countryCode}${phone}`, recaptcha: recaptchaToken })
        });
        setShowOtp(true);
        setMessage({ type: 'success', text: 'Ingresa el código enviado a tu correo para activar tu cuenta.' });
      } else {
        const data = await apiFetch('/auth.php?action=login', {
          method: 'POST',
          body: JSON.stringify({ email, password, recaptcha: recaptchaToken })
        });
        localStorage.setItem('token', data.token);
        navigate('/submit');
      }
    } catch (error: any) {
      if (error.message === 'Cuenta no verificada.') {
        setShowOtp(true);
        setMessage({ type: 'success', text: 'Por favor, verifica tu cuenta.' });
        
        // Reenviar código
        await apiFetch('/auth.php?action=register', {
          method: 'POST',
          body: JSON.stringify({ email, password, phone_number: `${countryCode}${phone}`, recaptcha: recaptchaToken })
        }).catch(() => {}); // ignore error on resend
      } else {
        setMessage({ type: 'error', text: error.message || 'Ha ocurrido un error durante la autenticación.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center relative">
      {/* Background element */}
      <div className="absolute inset-0 bg-carbon z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-carbon z-0 opacity-80 pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-md">
        
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#111111] border border-white/5 flex items-center justify-center">
            <Key className="w-6 h-6 text-clay" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="font-serif italic text-4xl text-cream mb-2">
            {showOtp ? 'Verificar Código' : isForgotPassword ? 'Recuperar Identidad' : isSignUp ? 'Identidad Segura' : 'Acceso Autorizado'}
          </h1>
          <p className="font-sans text-sm text-cream/50">
            {showOtp ? `Enviamos un código a ${email}` : isForgotPassword ? 'Enviaremos instrucciones de recuperación a tu correo.' : isSignUp ? 'Únete a la red de confianza cero para emprendedores.' : 'Ingresa tus credenciales para acceder a la base de datos.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="bg-[#111111] border border-white/5 rounded-3xl p-8 flex flex-col gap-6">
          
          {message && (
            <div className={`p-4 rounded-xl text-sm font-sans ${message.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
              {message.text}
            </div>
          )}

          {!showOtp ? (
            <>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-cream/50 pl-2">Correo Electrónico</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-carbon border border-white/10 rounded-2xl px-4 py-3 text-cream font-sans text-sm focus:outline-none focus:border-clay/50 transition-colors"
                  placeholder="operador@empresa.com"
                />
              </div>

              {isSignUp && (
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-cream/50 pl-2">Teléfono Personal</label>
                  <div className="flex bg-carbon border border-white/10 rounded-2xl overflow-hidden focus-within:border-clay/50 transition-colors">
                    <select 
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-transparent text-cream px-3 py-3 font-mono text-sm border-r border-white/5 outline-none appearance-none cursor-pointer"
                    >
                      <option value="+503" className="bg-carbon">+503 (SV)</option>
                      <option value="+502" className="bg-carbon">+502 (GT)</option>
                      <option value="+504" className="bg-carbon">+504 (HN)</option>
                    </select>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))}
                      required
                      className="bg-transparent text-cream px-4 py-3 font-sans text-sm w-full outline-none placeholder:text-cream/20"
                      placeholder="0000 0000"
                    />
                  </div>
                </div>
              )}

              {!isForgotPassword && (
                <div className="flex flex-col gap-2 relative">
                  <div className="flex justify-between items-center pl-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-cream/50">Contraseña</label>
                    {!isSignUp && (
                      <button 
                        type="button"
                        onClick={() => { setIsForgotPassword(true); setMessage(null); }}
                        className="font-sans text-[10px] text-clay/80 hover:text-clay transition-colors"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    )}
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-carbon border border-white/10 rounded-2xl px-4 py-3 text-cream font-sans text-sm focus:outline-none focus:border-clay/50 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-cream/50 pl-2">Código de Verificación</label>
                <input 
                  type="text" 
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  maxLength={6}
                  className="bg-carbon border border-white/10 rounded-2xl px-4 py-6 text-cream font-mono text-center text-2xl tracking-[1rem] focus:outline-none focus:border-clay transition-colors"
                  placeholder="000000"
                />
              </div>
              <p className="text-[10px] text-cream/30 text-center font-sans">
                Busca en tu bandeja de entrada el código de 6 dígitos.
              </p>
            </div>
          )}

          {!showOtp && !isForgotPassword && (
            <div className="flex justify-center my-2">
              <ReCAPTCHA
                sitekey="6LfvErAsAAAAAN9hVeGl3k9uqxRduc7Ci-IjWh70"
                onChange={(token) => setRecaptchaToken(token)}
                theme="dark"
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="magnetic-button w-full bg-clay text-cream py-4 rounded-2xl font-sans font-medium text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {isForgotPassword ? 'Enviar Enlace' : isSignUp ? 'Crear Identidad' : 'Iniciar Sesión'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="w-full h-px bg-white/5 my-2"></div>

          <div className="text-center">
            {showOtp ? (
              <button 
                type="button" 
                onClick={() => { setShowOtp(false); setMessage(null); }}
                className="font-sans text-xs text-cream/50 hover:text-clay transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-clay/40"
              >
                Cambiar datos de registro
              </button>
            ) : isForgotPassword ? (
              <button 
                type="button" 
                onClick={() => { setIsForgotPassword(false); setMessage(null); }}
                className="font-sans text-xs text-cream/50 hover:text-clay transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-clay/40"
              >
                Volver al inicio de sesión
              </button>
            ) : (
              <button 
                type="button" 
                onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }}
                className="font-sans text-xs text-cream/50 hover:text-clay transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-clay/40"
              >
                {isSignUp ? '¿Ya tienes una identidad? Inicia Sesión' : '¿No tienes acceso? Solicita una identidad'}
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-cream/30">
          <Shield className="w-3 h-3" />
          <span className="font-mono text-[9px] uppercase tracking-widest">Conexión Encriptada E2E</span>
        </div>
      </div>
    </div>
  );
};
