import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

/**
 * Register component (Formik + Yup) + i18n
 * - يحافظ على التصميم الأصلي والـ animations
 * - جميع النصوص ورسائل الخطأ تستخدم t(...) للترجمة
 */
export default function Register({ onToggleMode, onRegister }) {
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // password strength logic (same as قبل)
  const passwordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // Build validation schema using translated messages
  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string()
        .trim()
        .min(2, t('register.errors.nameMin', 'Name must be at least 2 characters'))
        .required(t('register.errors.nameRequired', 'Full name is required')),
      email: Yup.string()
        .trim()
        .email(t('register.errors.emailValid', 'Please enter a valid email'))
        .required(t('register.errors.emailRequired', 'Email is required')),
      password: Yup.string()
        .required(t('register.errors.passwordRequired', 'Password is required'))
        .min(8, t('register.errors.passwordMin', 'Password must be at least 8 characters'))
        .matches(/(?=.*[a-z])/, t('register.errors.passwordLower', 'Password must contain a lowercase letter'))
        .matches(/(?=.*[A-Z])/, t('register.errors.passwordUpper', 'Password must contain an uppercase letter'))
        .matches(/(?=.*\d)/, t('register.errors.passwordNumber', 'Password must contain a number')),
      confirmPassword: Yup.string()
        .required(t('register.errors.confirmRequired', 'Please confirm your password'))
        .oneOf([Yup.ref('password')], t('register.errors.passwordMatch', 'Passwords do not match')),
      agreedToTerms: Yup.boolean()
        .oneOf([true], t('register.errors.terms', 'You must agree to the terms and conditions')),
    });
  }, [t]);

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setSubmitting(true);
    setIsLoading(true);
    setStatus(null);

    try {
      // simulate API call
      await new Promise((r) => setTimeout(r, 1200));

      const user = {
        id: Date.now(),
        name: values.name,
        email: values.email,
        avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=600&q=80`,
      };

      // success callback
      onRegister(user);

      // optional success message via status
      setStatus({ success: t('register.success', 'Account created successfully') });

    } catch (err) {
      setStatus({ error: t('register.failed', 'Registration failed. Please try again.') });
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass rounded-3xl p-8 border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          >
            <User className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gradient mb-2">{t('register.title', 'Create Account')}</h2>
          <p className="text-fg/70">{t('register.subtitle', 'Join thousands of learners worldwide')}</p>
        </div>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, isSubmitting, setFieldValue, status }) => {
            const strength = passwordStrength(values.password);
            return (
              <Form className="space-y-6" noValidate>
                {/* status messages */}
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

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-fg mb-2">
                    {t('register.fields.name', 'Full Name')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-fg/50" />
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      placeholder={t('register.placeholders.name', 'Enter your full name')}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200`}
                    />
                  </div>
                  <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-400" />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-fg mb-2">
                    {t('register.fields.email', 'Email Address')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-fg/50" />
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t('register.placeholders.email', 'Enter your email')}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200`}
                    />
                  </div>
                  <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-400" />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-fg mb-2">
                    {t('register.fields.password', 'Password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-fg/50" />
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('register.placeholders.password', 'Create a strong password')}
                      className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fg/50 hover:text-fg transition-colors"
                      aria-label={showPassword ? t('register.hidePassword', 'Hide password') : t('register.showPassword', 'Show password')}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Strength */}
                  {values.password && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              level <= strength ? getPasswordStrengthColor(strength) : 'bg-white/20'
                            }`}
                            aria-hidden
                          />
                        ))}
                      </div>
                      <p className="text-xs text-fg/60 mt-1">
                        {strength <= 2 && t('register.strength.weak', 'Weak password')}
                        {strength === 3 && t('register.strength.fair', 'Fair password')}
                        {strength === 4 && t('register.strength.good', 'Good password')}
                        {strength === 5 && t('register.strength.strong', 'Strong password')}
                      </p>
                    </div>
                  )}

                  <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-400" />
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-fg mb-2">
                    {t('register.fields.confirmPassword', 'Confirm Password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-fg/50" />
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('register.placeholders.confirmPassword', 'Confirm your password')}
                      className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fg/50 hover:text-fg transition-colors"
                      aria-label={showConfirmPassword ? t('register.hidePassword', 'Hide password') : t('register.showPassword', 'Show password')}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>

                    {values.confirmPassword && values.password === values.confirmPassword && (
                      <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-sm text-red-400" />
                </div>

                {/* Terms */}
                <div>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={values.agreedToTerms}
                      onChange={(e) => setFieldValue('agreedToTerms', e.target.checked)}
                      className="w-5 h-5 text-green-500 bg-white/10 border-white/20 rounded focus:ring-green-500 focus:ring-2 mt-0.5"
                    />
                    <span className="text-sm text-fg/70">
                      {t('register.termsPrefix', 'I agree to the')}{' '}
                      <a href="#" className="text-green-400 hover:text-green-300 underline">{t('register.terms', 'Terms of Service')}</a>
                      {' '} {t('register.and', 'and')} {' '}
                      <a href="#" className="text-green-400 hover:text-green-300 underline">{t('register.privacy', 'Privacy Policy')}</a>
                    </span>
                  </label>
                  <ErrorMessage name="agreedToTerms" component="p" className="mt-1 text-sm text-red-400" />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r cursor-pointer from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('register.creating', 'Creating account...')}
                    </>
                  ) : (
                    <>
                      {t('register.createAccount', 'Create Account')}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                {/* Divider */}
                <div className="my-6 flex items-center">
                  <div className="flex-1 border-t border-white/20" />
                  <span className="px-4 text-sm text-fg/50">{t('register.or', 'or')}</span>
                  <div className="flex-1 border-t border-white/20" />
                </div>

                {/* Social Buttons */}
                <div className="space-y-3">
                  <button type="button" className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200">
                    {/* Google SVG kept simple */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    </svg>
                    {t('register.continueWithGoogle', 'Continue with Google')}
                  </button>

                  <button type="button" className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    {t('register.continueWithFacebook', 'Continue with Facebook')}
                  </button>
                </div>

                {/* Toggle Mode */}
                <div className="mt-6 text-center">
                  <p className="text-fg/70 ">
                    {t('register.alreadyHave', 'Already have an account?')}{' '}
                    <button
                      type="button"
                      onClick={onToggleMode}
                      className="text-green-400 cursor-pointer hover:text-green-300 font-semibold transition-colors"
                    >
                      {t('register.signIn', 'Sign in')}
                    </button>
                  </p>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </motion.div>
  );
}
