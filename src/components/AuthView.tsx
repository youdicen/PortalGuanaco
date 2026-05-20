import React, { useState } from 'react';
import { apiFetch } from '../lib/api';
import { Loader2, Key, Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

type ForgotStep = 'email' | 'reset';

export const AuthView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+503');
  const [otpCode, setOtpCode] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptNotifications, setAcceptNotifications] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && !acceptPrivacy) {
      setMessage({ type: 'error', text: 'Debes aceptar la política de privacidad para continuar.' });
      return;
    }
    setIsLoading(true);
    setMessage(null);

    try {
      // ── OTP verification ──────────────────────────────────────────────────
      if (showOtp) {
        const data = await apiFetch('/auth.php?action=verify', {
          method: 'POST',
          body: JSON.stringify({ email, code: otpCode })
        });
        localStorage.setItem('token', data.token);
        window.dispatchEvent(new CustomEvent('auth-changed'));
        navigate('/submit');
        return;
      }

      // ── Forgot password — Step 1: request code ────────────────────────────
      if (isForgotPassword && forgotStep === 'email') {
        const data = await apiFetch('/auth.php?action=forgot_password', {
          method: 'POST',
          body: JSON.stringify({ email })
        });
        setMessage({ type: 'success', text: data.message || 'Si el correo existe, recibirás un código en breve.' });
        setForgotStep('reset');
        return;
      }

      // ── Forgot password — Step 2: submit code + new password ──────────────
      if (isForgotPassword && forgotStep === 'reset') {
        await apiFetch('/auth.php?action=reset_password', {
          method: 'POST',
          body: JSON.stringify({ email, code: otpCode, password: newPassword })
        });
        setMessage({ type: 'success', text: 'Contraseña actualizada. Ya puedes iniciar sesión.' });
        setTimeout(() => {
          setIsForgotPassword(false);
          setForgotStep('email');
          setOtpCode('');
          setNewPassword('');
          setMessage(null);
        }, 2500);
        return;
      }

      // ── Sign up ───────────────────────────────────────────────────────────
      if (isSignUp) {
        await apiFetch('/auth.php?action=register', {
          method: 'POST',
          body: JSON.stringify({ 
            email, 
            password, 
            phone: `${countryCode}${phone}`,
            acceptsNotifications: acceptNotifications 
          })
        });
        setShowOtp(true);
        setMessage({ type: 'success', text: 'Ingresa el código enviado a tu correo para activar tu cuenta.' });
        return;
      }

      // ── Login ─────────────────────────────────────────────────────────────
      const data = await apiFetch('/auth.php?action=login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('token', data.token);
      window.dispatchEvent(new CustomEvent('auth-changed'));
      navigate('/submit');

    } catch (error: any) {
      if (error.message === 'Cuenta no verificada.') {
        setShowOtp(true);
        setMessage({ type: 'success', text: 'Por favor, verifica tu cuenta.' });
        await apiFetch('/auth.php?action=register', {
          method: 'POST',
          body: JSON.stringify({ email, password, phone_number: `${countryCode}${phone}` })
        }).catch(() => {});
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
            {showOtp
              ? `Enviamos un código a ${email}`
              : isForgotPassword && forgotStep === 'email'
              ? 'Ingresa tu correo y te enviaremos un código de recuperación.'
              : isForgotPassword && forgotStep === 'reset'
              ? `Ingresa el código enviado a ${email} y tu nueva contraseña.`
              : isSignUp
              ? 'Únete a la red de confianza cero para emprendedores.'
              : 'Ingresa tus credenciales para acceder a la base de datos.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="bg-[#111111] border border-white/5 rounded-3xl p-8 flex flex-col gap-6">
          
          {message && (
            <div className={`p-4 rounded-xl text-sm font-sans ${message.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
              {message.text}
            </div>
          )}

          {/* ── Forgot Step 2: code + new password ── */}
          {isForgotPassword && forgotStep === 'reset' ? (
            <>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-cream/50 pl-2">Código de Recuperación</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="bg-carbon border border-white/10 rounded-2xl px-4 py-5 text-cream font-mono text-center text-2xl tracking-[1rem] focus:outline-none focus:border-clay transition-colors"
                  placeholder="000000"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-cream/50 pl-2">Nueva Contraseña</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-carbon border border-white/10 rounded-2xl px-4 pr-12 py-3 text-cream font-sans text-sm focus:outline-none focus:border-clay/50 transition-colors"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-clay transition-colors"
                    tabIndex={-1}
                    aria-label={showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : !showOtp ? (
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
                <div className="flex flex-col gap-2">
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
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-carbon border border-white/10 rounded-2xl px-4 pr-12 py-3 text-cream font-sans text-sm focus:outline-none focus:border-clay/50 transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-clay transition-colors"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {isSignUp && (
                <div className="flex flex-col gap-4 mt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-1">
                      <input 
                        type="checkbox"
                        checked={acceptPrivacy}
                        onChange={(e) => setAcceptPrivacy(e.target.checked)}
                        required
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border border-white/10 rounded-md bg-carbon group-hover:border-clay/50 transition-colors flex items-center justify-center peer-checked:bg-clay peer-checked:border-clay">
                        <ArrowRight className="w-3 h-3 text-cream rotate-[-45deg] peer-checked:rotate-0 transition-transform" />
                      </div>
                    </div>
                    <span className="text-xs text-cream/50 leading-relaxed font-sans">
                      Acepto la <Link to="/privacy" className="text-clay hover:underline">Política de Privacidad</Link> y los términos operativos de la plataforma. <span className="text-clay">*</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-1">
                      <input 
                        type="checkbox"
                        checked={acceptNotifications}
                        onChange={(e) => setAcceptNotifications(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border border-white/10 rounded-md bg-carbon group-hover:border-clay/50 transition-colors flex items-center justify-center peer-checked:bg-clay peer-checked:border-clay">
                        <ArrowRight className="w-3 h-3 text-cream rotate-[-45deg] peer-checked:rotate-0 transition-transform" />
                      </div>
                    </div>
                    <span className="text-xs text-cream/30 leading-relaxed font-sans group-hover:text-cream/50 transition-colors">
                      Deseo recibir actualizaciones críticas y notificaciones de seguridad en mi correo electrónico.
                    </span>
                  </label>
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

          <button 
            type="submit" 
            disabled={isLoading}
            className="magnetic-button w-full bg-clay text-cream py-4 rounded-2xl font-sans font-medium text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {isForgotPassword && forgotStep === 'email'
                  ? 'Enviar Código'
                  : isForgotPassword && forgotStep === 'reset'
                  ? 'Cambiar Contraseña'
                  : isSignUp ? 'Crear Identidad' : 'Iniciar Sesión'}
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
                onClick={() => {
                  if (forgotStep === 'reset') {
                    setForgotStep('email');
                    setOtpCode('');
                    setNewPassword('');
                  } else {
                    setIsForgotPassword(false);
                  }
                  setMessage(null);
                }}
                className="font-sans text-xs text-cream/50 hover:text-clay transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-clay/40"
              >
                {forgotStep === 'reset' ? '← Cambiar correo' : 'Volver al inicio de sesión'}
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
