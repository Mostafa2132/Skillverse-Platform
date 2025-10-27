import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

/**
 * Login component (Formik + Yup) + i18n
 * - جاهز للترجمة عبر t(...)
 * - يحافظ على واجهة المستخدم والحركات الأصلية
 */
export default function Login({ onToggleMode, onLogin }) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      email: Yup.string()
        .trim()
        .email(t('login.errors.emailValid', 'Please enter a valid email'))
        .required(t('login.errors.emailRequired', 'Email is required')),
      password: Yup.string()
        .required(t('login.errors.passwordRequired', 'Password is required'))
        .min(6, t('login.errors.passwordMin', 'Password must be at least 6 characters')),
      remember: Yup.boolean(),
    });
  }, [t]);

  const initialValues = {
    email: '',
    password: '',
    remember: false,
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setSubmitting(true);
    setIsLoading(true);
    setStatus(null);

    try {
      // simulate API call
      await new Promise((r) => setTimeout(r, 1200));

      // mock user returned from API
      const user = {
        id: Date.now(),
        name: 'Mostafa Mohamed',
        email: values.email,
        avatar:
          'https://images.unsplash.com/photo-1545996124-1b0a0b6f1b8f?auto=format&fit=crop&w=600&q=80',
      };

      // success callback
      onLogin(user);

      setStatus({ success: t('login.success', 'Signed in successfully') });
    } catch (err) {
      setStatus({ error: t('login.failed', 'Login failed. Please try again.') });
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass rounded-3xl p-8 border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          >
            <User className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-2xl font-bold text-gradient mb-2">
            {t('login.title', 'Welcome Back')}
          </h2>
          <p className="text-fg/70">
            {t('login.subtitle', 'Sign in to continue your learning journey')}
          </p>
        </div>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, isSubmitting, setFieldValue, status }) => (
            <Form className="space-y-6" noValidate>
              {/* status */}
              {status?.error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {status.error}
                </motion.div>
              )}
              {status?.success && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                  {status.success}
                </motion.div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-fg mb-2">
                  {t('login.fields.email', 'Email Address')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-fg/50" />
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t('login.placeholders.email', 'Enter your email')}
                    className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200`}
                  />
                </div>
                <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-400" />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-fg mb-2">
                  {t('login.fields.password', 'Password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-fg/50" />
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('login.placeholders.password', 'Enter your password')}
                    className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fg/50 hover:text-fg transition-colors"
                    aria-label={showPassword ? t('login.hidePassword', 'Hide password') : t('login.showPassword', 'Show password')}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-400" />
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={values.remember}
                    onChange={(e) => setFieldValue('remember', e.target.checked)}
                    className="w-4 h-4 text-indigo-500 bg-white/10 border-white/20 rounded focus:ring-indigo-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-fg/70">{t('login.remember', 'Remember me')}</span>
                </label>

                <button
                  type="button"
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {t('login.forgot', 'Forgot password?')}
                </button>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isSubmitting || isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r cursor-pointer from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('login.signing', 'Signing in...')}
                  </>
                ) : (
                  <>
                    {t('login.signIn', 'Sign In')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-white/20" />
                <span className="px-4 text-sm text-fg/50">{t('login.or', 'or')}</span>
                <div className="flex-1 border-t border-white/20" />
              </div>

              {/* Social */}
              <div className="space-y-3">
                <button type="button" className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  </svg>
                  {t('login.continueWithGoogle', 'Continue with Google')}
                </button>

                <button type="button" className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  {t('login.continueWithFacebook', 'Continue with Facebook')}
                </button>
              </div>

              {/* Toggle Mode */}
              <div className="mt-6 text-center">
                <p className="text-fg/70">
                  {t('login.noAccount', "Don't have an account?")}{' '}
                  <button
                    type="button"
                    onClick={onToggleMode}
                    className="text-indigo-400 cursor-pointer hover:text-indigo-300 font-semibold transition-colors"
                  >
                    {t('login.signUp', 'Sign up')}
                  </button>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </motion.div>
  );
}
