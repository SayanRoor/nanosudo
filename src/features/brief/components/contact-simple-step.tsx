'use client';

/**
 * Step 3: Let's get to know each other (WHO)
 * Contact information with minimal friction
 */

import type { ReactElement } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building2, MessageCircle, Send } from 'lucide-react';
import { useBriefSimpleStep } from '../hooks/use-brief-simple-step';
import { BriefSimpleStepNavigator } from './brief-simple-step-navigator';

const contactMethods = [
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { value: 'telegram', label: 'Telegram', icon: Send },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'phone', label: 'Звонок', icon: Phone },
] as const;

export function ContactSimpleStep(): ReactElement {
  const { form } = useBriefSimpleStep('contact');
  const { register, watch, setValue, formState: { errors } } = form;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedMethod = watch('preferredContact');

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    // Form submission will be handled by parent component
    // This is just for UI feedback
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <User className="w-4 h-4 text-accent" />
          Как вас зовут? <span className="text-destructive">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background focus:border-accent focus:outline-none transition-colors"
          placeholder="Иван Иванов"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Mail className="w-4 h-4 text-accent" />
          Email <span className="text-destructive">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background focus:border-accent focus:outline-none transition-colors"
          placeholder="ivan@example.com"
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      {/* Phone (optional) */}
      <div className="space-y-2">
        <label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Phone className="w-4 h-4 text-accent" />
          Телефон <span className="text-xs text-muted-foreground font-normal">(необязательно)</span>
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background focus:border-accent focus:outline-none transition-colors"
          placeholder="+7 (777) 123-45-67"
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
      </div>

      {/* Company (optional) */}
      <div className="space-y-2">
        <label htmlFor="company" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Building2 className="w-4 h-4 text-accent" />
          Компания <span className="text-xs text-muted-foreground font-normal">(необязательно)</span>
        </label>
        <input
          id="company"
          type="text"
          {...register('company')}
          className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background focus:border-accent focus:outline-none transition-colors"
          placeholder="ТОО 'Рога и Копыта'"
        />
        {errors.company && <p className="text-sm text-destructive">{errors.company.message}</p>}
      </div>

      {/* Preferred Contact Method */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-foreground">
          Как удобнее связаться? <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.value;
            return (
              <motion.button
                key={method.value}
                type="button"
                onClick={() => setValue('preferredContact', method.value, { shouldValidate: true })}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  isSelected ? 'border-accent bg-accent/5' : 'border-border/60 hover:border-accent/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-accent' : 'text-muted-foreground'}`} />
                <p className={`text-xs font-semibold ${isSelected ? 'text-accent' : 'text-foreground'}`}>
                  {method.label}
                </p>
              </motion.button>
            );
          })}
        </div>
        {errors.preferredContact && <p className="text-sm text-destructive">{errors.preferredContact.message}</p>}
      </div>

      {/* Privacy Note */}
      <div className="p-4 rounded-lg bg-muted/20 border border-border/40">
        <p className="text-xs text-muted-foreground leading-relaxed">
          🔒 Ваши данные используются только для связи по проекту и не передаются третьим лицам.
          Отправляя заявку, вы соглашаетесь с обработкой персональных данных.
        </p>
      </div>

      <div onClick={() => void handleSubmit()}>
        <BriefSimpleStepNavigator stepId="contact" />
      </div>

      {isSubmitting && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Отправляем заявку...</p>
        </div>
      )}
    </div>
  );
}
