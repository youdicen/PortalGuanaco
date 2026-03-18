import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, ArrowRight, Loader2, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AuthView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (showOtp) {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otpCode,
          type: 'signup'
        });
        if (error) throw error;
        navigate('/submit');
        return;
      }

      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage({ type: 'success', text: 'Si el correo existe, se enviará un enlace de recuperación en breve.' });
      } else if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              phone_number: phone
            }
          }
        });
        if (error) throw error;
        setShowOtp(true);
        setMessage({ type: 'success', text: 'Ingresa el código enviado a tu correo para activar tu cuenta.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/submit');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Ha ocurrido un error durante la autenticación.' });
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
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="bg-carbon border border-white/10 rounded-2xl px-4 py-3 text-cream font-sans text-sm focus:outline-none focus:border-clay/50 transition-colors"
                    placeholder="+503 0000 0000"
                  />
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
