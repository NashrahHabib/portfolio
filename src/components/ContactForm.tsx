import { useRef, useState, type FormEvent } from 'react';
import { site } from '../data/site';

const PROJECT_TYPES = ['Custom WordPress development', 'WordPress theme', 'WooCommerce store', 'Shopify store', 'Website maintenance', 'Something else'];
const BUDGETS = ['Not sure yet', 'Under $500', '$500 – $1,500', '$1,500 – $5,000', 'Over $5,000'];

type Status = { kind: 'idle' | 'sending' | 'success' | 'error' | 'draft'; message?: string };
type Errors = Partial<Record<'name' | 'email' | 'projectType' | 'message', string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Contact form.
 *
 * - With VITE_FORM_ENDPOINT set, it POSTs JSON to that endpoint (a form service such as
 *   Formspree or Web3Forms, or your own server). No keys or credentials live in this code.
 * - Without it, the form opens a pre-filled email draft so it still works on a static host.
 *
 * Spam protection: a hidden honeypot field and a minimum fill time. Add the form
 * service's own spam filtering or a captcha on top if you start receiving junk.
 */
export default function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', projectType: '', budget: '', message: '', company: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const startedAt = useRef(Date.now());
  const configured = Boolean(site.formEndpoint);

  const set = (key: keyof typeof values) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [key]: e.target.value }));

  function validate(): Errors {
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = 'Enter your name.';
    if (!EMAIL.test(values.email.trim())) next.email = 'Enter an email address like name@example.com.';
    if (!values.projectType) next.projectType = 'Choose the type of project.';
    if (values.message.trim().length < 10) next.message = 'Describe the project in at least 10 characters.';
    else if (values.message.length > 5000) next.message = 'Keep the message under 5,000 characters.';
    return next;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`cf-${first}`)?.focus();
      setStatus({ kind: 'idle' });
      return;
    }

    // Spam checks: bots fill the hidden field or submit instantly. Pretend it worked.
    if (values.company || Date.now() - startedAt.current < 3000) {
      setStatus({ kind: 'success', message: 'Message sent. I’ll reply by email.' });
      return;
    }

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      projectType: values.projectType,
      budget: values.budget || 'Not specified',
      message: values.message.trim(),
    };

    if (!configured) {
      const body = `${payload.message}\n\nProject type: ${payload.projectType}\nBudget: ${payload.budget}\n\n${payload.name}\n${payload.email}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Project enquiry from ${payload.name}`)}&body=${encodeURIComponent(body)}`;
      setStatus({ kind: 'draft', message: `Email draft opened. Press send in your email app to deliver it. If nothing opened, write to ${site.email}.` });
      return;
    }

    setStatus({ kind: 'sending' });
    try {
      const res = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Form endpoint responded with ${res.status}`);
      setStatus({ kind: 'success', message: 'Message sent. I’ll reply by email.' });
      setValues({ name: '', email: '', projectType: '', budget: '', message: '', company: '' });
    } catch {
      setStatus({ kind: 'error', message: `The message could not be sent. Please email ${site.email} directly.` });
    }
  }

  const describe = (key: keyof Errors) => (errors[key] ? { 'aria-invalid': true, 'aria-describedby': `cf-${key}-error` } : {});
  const error = (key: keyof Errors) => errors[key] && <p id={`cf-${key}-error`} role="alert" className="mt-1 text-sm text-danger">{errors[key]}</p>;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7">
      {import.meta.env.DEV && !configured && (
        <p className="rounded-box border border-dashed border-accent p-4 text-sm">
          Developer note (not shown on the live site): no form endpoint is connected. Set <code>VITE_FORM_ENDPOINT</code> to a form
          service URL to send messages directly. Until then the form opens an email draft.
        </p>
      )}

      <div>
        <label htmlFor="cf-name" className="label mb-1 block">Name (required)</label>
        <input id="cf-name" className="field" type="text" autoComplete="name" value={values.name} onChange={set('name')} required {...describe('name')} />
        {error('name')}
      </div>

      <div>
        <label htmlFor="cf-email" className="label mb-1 block">Email (required)</label>
        <input id="cf-email" className="field" type="email" autoComplete="email" value={values.email} onChange={set('email')} required {...describe('email')} />
        {error('email')}
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-projectType" className="label mb-1 block">Project type (required)</label>
          <select id="cf-projectType" className="field" value={values.projectType} onChange={set('projectType')} required {...describe('projectType')}>
            <option value="">Select one</option>
            {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {error('projectType')}
        </div>
        <div>
          <label htmlFor="cf-budget" className="label mb-1 block">Budget (optional)</label>
          <select id="cf-budget" className="field" value={values.budget} onChange={set('budget')}>
            <option value="">Select one</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" className="label mb-1 block">Message (required)</label>
        <textarea id="cf-message" className="field resize-y" rows={5} value={values.message} onChange={set('message')} required {...describe('message')} />
        {error('message')}
      </div>

      {/* Honeypot: hidden from people, tempting for bots. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="cf-company">Company</label>
        <input id="cf-company" type="text" tabIndex={-1} autoComplete="off" value={values.company} onChange={set('company')} />
      </div>

      <div>
        <button type="submit" className="btn btn-solid" disabled={status.kind === 'sending'}>
          {status.kind === 'sending' ? 'Sending…' : configured ? 'Send Message' : 'Open Email Draft'}
        </button>
        {!configured && <p className="mt-3 text-sm text-muted">This opens a draft in your email app with your message filled in.</p>}
        <p aria-live="polite" className={`mt-3 ${status.kind === 'error' ? 'text-danger' : ''}`}>{status.message}</p>
      </div>
    </form>
  );
}
