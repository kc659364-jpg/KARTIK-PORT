'use client';

import { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { isValidEmail } from '@/lib/utils';

const SERVICES_OPTIONS = [
  'Website Development',
  'Web Application Development',
  'AI Workflow Automation',
  'UI/UX and Visual Design',
  'Video Editing',
  'Interactive 3D Website',
  'Other',
];

const BUDGET_OPTIONS = [
  'Under $100 / ₹9,000',
  '$200 – $500 / ₹18k – ₹45L',
  '$1,500 – $3,000 / ₹1.2L – ₹2.5L',
  '$3,000+ / ₹2.5L+',
  'Flexible / Let’s Discuss',
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'Website Development',
    budget: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [responseMessage, setResponseMessage] = useState('');
  const [showWhatsAppLink, setShowWhatsAppLink] = useState(false);

  // Listen for 'select-service' events from ServiceCard clicks
  useEffect(() => {
    const handleSelectService = (e) => {
      if (e.detail) {
        setFormData((prev) => ({ ...prev, service: e.detail }));
      }
    };
    window.addEventListener('select-service', handleSelectService);
    return () => window.removeEventListener('select-service', handleSelectService);
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!isValidEmail(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.service) {
      errs.service = 'Please select a service';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please provide details about your project';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Please provide a bit more detail (at least 10 characters)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setResponseMessage('');
    setShowWhatsAppLink(false);

    // Your WhatsApp number in international format, without +, spaces, or dashes.
    const whatsappNumber = '919737275089';
    const message = [
      'Hello Kartik! You have received a new portfolio inquiry.',
      '',
      `Name: ${formData.name.trim()}`,
      `Email: ${formData.email.trim()}`,
      `Company / Brand: ${formData.company.trim() || 'Not provided'}`,
      `Service Required: ${formData.service}`,
      `Approximate Budget: ${formData.budget || 'Not provided'}`,
      '',
      'Project Details / Message:',
      formData.message.trim(),
    ].join('\n');

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open(whatsappUrl, '_blank');

    setStatus('success');
    setResponseMessage(
      whatsappWindow
        ? 'WhatsApp opened with the inquiry filled in. Please review the message and press Send in WhatsApp to deliver it to Kartik.'
        : 'Your inquiry is ready. If WhatsApp did not open automatically, use the button below to open it and send your message.'
    );
    setShowWhatsAppLink(!whatsappWindow);
  };

  const whatsappFallback = `https://wa.me/919737275089?text=${encodeURIComponent(
    [
      'Hello Kartik! You have received a new portfolio inquiry.',
      '',
      `Name: ${formData.name.trim()}`,
      `Email: ${formData.email.trim()}`,
      `Company / Brand: ${formData.company.trim() || 'Not provided'}`,
      `Service Required: ${formData.service}`,
      `Approximate Budget: ${formData.budget || 'Not provided'}`,
      '',
      'Project Details / Message:',
      formData.message.trim(),
    ].join('\n')
  )}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Status banner */}
      {status === 'success' && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-start gap-3 text-sm animate-fade-in"
        >
          <CheckCircle2 size={19} className="text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <strong className="font-semibold text-white">WhatsApp Inquiry Prepared!</strong>
            <p className="m-0 text-emerald-200/90 text-xs sm:text-sm">{responseMessage}</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 flex items-start gap-3 text-sm animate-fade-in"
        >
          <AlertCircle size={19} className="text-rose-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-2">
            <div>
              <strong className="font-semibold text-white">Submission Issue</strong>
              <p className="m-0 text-rose-200/90 text-xs sm:text-sm mt-0.5">{responseMessage}</p>
            </div>
            {showWhatsAppLink && (
              <a
                href={whatsappFallback}
                className="inline-block text-xs font-semibold text-white underline hover:text-caramel dark:hover:text-blue-400 transition-colors"
              >
                Open WhatsApp and Send Inquiry &rarr;
              </a>
            )}
          </div>
        </div>
      )}

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-xs font-medium text-[#241714] dark:text-[#FFFFFF] tracking-wide">
            Your Name <span className="text-[#4B2E2B] dark:text-[#2563EB] ml-0.5">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Kartik"
            className={`w-full px-4 py-3 bg-[#FFFFFF] dark:bg-[#0B0F19] border rounded-md text-[#241714] dark:text-[#FFFFFF] font-body text-sm placeholder:text-[#5C4845]/50 dark:placeholder:text-[#94A3B8]/50 focus:outline-none focus:border-[#4B2E2B] dark:focus:border-[#2563EB] focus:ring-2 focus:ring-[#4B2E2B]/20 dark:focus:ring-[#2563EB]/20 transition-all ${
              errors.name ? 'border-rose-400' : 'border-[#D8C7B3] dark:border-[#1E293B]'
            }`}
            disabled={status === 'loading'}
            required
            suppressHydrationWarning
          />
          {errors.name && <span className="text-xs text-rose-400">{errors.name}</span>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-xs font-medium text-[#241714] dark:text-[#FFFFFF] tracking-wide">
            Email Address <span className="text-[#4B2E2B] dark:text-[#2563EB] ml-0.5">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="kartik@example.com"
            className={`w-full px-4 py-3 bg-[#FFFFFF] dark:bg-[#0B0F19] border rounded-md text-[#241714] dark:text-[#FFFFFF] font-body text-sm placeholder:text-[#5C4845]/50 dark:placeholder:text-[#94A3B8]/50 focus:outline-none focus:border-[#4B2E2B] dark:focus:border-[#2563EB] focus:ring-2 focus:ring-[#4B2E2B]/20 dark:focus:ring-[#2563EB]/20 transition-all ${
              errors.email ? 'border-rose-400' : 'border-[#D8C7B3] dark:border-[#1E293B]'
            }`}
            disabled={status === 'loading'}
            required
            suppressHydrationWarning
          />
          {errors.email && <span className="text-xs text-rose-400">{errors.email}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Company */}
        <div className="flex flex-col gap-2">
          <label htmlFor="company" className="text-xs font-medium text-[#241714] dark:text-[#FFFFFF] tracking-wide">
            Company or Brand <span className="opacity-60 text-[11px]">(Optional)</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            placeholder="Acme Studio"
            className="w-full px-4 py-3 bg-[#FFFFFF] dark:bg-[#0B0F19] border border-[#D8C7B3] dark:border-[#1E293B] rounded-md text-[#241714] dark:text-[#FFFFFF] font-body text-sm placeholder:text-[#5C4845]/50 dark:placeholder:text-[#94A3B8]/50 focus:outline-none focus:border-[#4B2E2B] dark:focus:border-[#2563EB] focus:ring-2 focus:ring-[#4B2E2B]/20 dark:focus:ring-[#2563EB]/20 transition-all"
            disabled={status === 'loading'}
            suppressHydrationWarning
          />
        </div>

        {/* Service */}
        <div className="flex flex-col gap-2">
          <label htmlFor="service" className="text-xs font-medium text-[#241714] dark:text-[#FFFFFF] tracking-wide">
            Service Required <span className="text-[#4B2E2B] dark:text-[#2563EB] ml-0.5">*</span>
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-[#FFFFFF] dark:bg-[#0B0F19] border rounded-md text-[#241714] dark:text-[#FFFFFF] font-body text-sm focus:outline-none focus:border-[#4B2E2B] dark:focus:border-[#2563EB] focus:ring-2 focus:ring-[#4B2E2B]/20 dark:focus:ring-[#2563EB]/20 transition-all [&>option]:bg-white dark:[&>option]:bg-[#0B0F19] [&>option]:text-[#241714] dark:[&>option]:text-[#FFFFFF] ${
              errors.service ? 'border-rose-400' : 'border-[#D8C7B3] dark:border-[#1E293B]'
            }`}
            disabled={status === 'loading'}
            required
            suppressHydrationWarning
          >
            {SERVICES_OPTIONS.map((srv) => (
              <option key={srv} value={srv}>
                {srv}
              </option>
            ))}
          </select>
          {errors.service && <span className="text-xs text-rose-400">{errors.service}</span>}
        </div>
      </div>

      {/* Budget */}
      <div className="flex flex-col gap-2">
        <label htmlFor="budget" className="text-xs font-medium text-[#241714] dark:text-[#FFFFFF] tracking-wide">
          Approximate Budget <span className="opacity-60 text-[11px]">(Optional)</span>
        </label>
        <select
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#FFFFFF] dark:bg-[#0B0F19] border border-[#D8C7B3] dark:border-[#1E293B] rounded-md text-[#241714] dark:text-[#FFFFFF] font-body text-sm focus:outline-none focus:border-[#4B2E2B] dark:focus:border-[#2563EB] focus:ring-2 focus:ring-[#4B2E2B]/20 dark:focus:ring-[#2563EB]/20 transition-all [&>option]:bg-white dark:[&>option]:bg-[#0B0F19] [&>option]:text-[#241714] dark:[&>option]:text-[#FFFFFF]"
          disabled={status === 'loading'}
          suppressHydrationWarning
        >
          <option value="">Select budget range...</option>
          {BUDGET_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-xs font-medium text-[#241714] dark:text-[#FFFFFF] tracking-wide">
          Project Details / Message <span className="text-[#4B2E2B] dark:text-[#2563EB] ml-0.5">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Briefly describe what you're looking to build, your timeline, or any specific requirements..."
          className={`w-full px-4 py-3 bg-[#FFFFFF] dark:bg-[#0B0F19] border rounded-md text-[#241714] dark:text-[#FFFFFF] font-body text-sm placeholder:text-[#5C4845]/50 dark:placeholder:text-[#94A3B8]/50 focus:outline-none focus:border-[#4B2E2B] dark:focus:border-[#2563EB] focus:ring-2 focus:ring-[#4B2E2B]/20 dark:focus:ring-[#2563EB]/20 transition-all min-h-[120px] resize-y ${
            errors.message ? 'border-rose-400' : 'border-[#D8C7B3] dark:border-[#1E293B]'
          }`}
          disabled={status === 'loading'}
          rows={4}
          required
          suppressHydrationWarning
        />
        {errors.message && <span className="text-xs text-rose-400">{errors.message}</span>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-2 w-full inline-flex items-center justify-center gap-2.5 bg-[#4B2E2B] dark:bg-[#2563EB] hover:bg-[#38211E] dark:hover:bg-[#1D4ED8] text-white font-body text-sm font-semibold py-3.5 px-8 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-md dark:shadow-[#2563EB]/25 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={status === 'loading'}
        suppressHydrationWarning
      >
        {status === 'loading' ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Sending Inquiry...</span>
          </>
        ) : (
          <>
            <span>Continue to WhatsApp</span>
            <Send size={15} />
          </>
        )}
      </button>
    </form>
  );
}
