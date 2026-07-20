import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SplitHeadline from "@/components/SplitHeadline";
import FormShell, { Field } from "@/components/FormShell";
import Reveal from "@/components/Reveal";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Rotaract Coimbatore Gaalaxy for collaborations, membership inquiries, or project partnerships.",
};

export default async function ContactPage() {
  const site = await getSiteSettings();
  return (
    <>
      <Header tone="light" />
      <main>
        <section className="pt-52 pb-20 max-md:pt-32">
          <div className="shell">
            <SplitHeadline
              as="h1"
              lines={[
                <span key="l1">
                  Say hello <span className="text-starlight">✦</span>
                </span>,
              ]}
              className="max-w-3xl text-[140px] font-extrabold leading-[1.06] tracking-tight text-ink max-lg:text-[80px] max-md:text-[56px]"
            />
            <div className="mt-14 flex flex-wrap justify-between gap-10">
              <div>
                <p className="text-[20px] font-extrabold lowercase text-ink">we&apos;re always here to chat</p>
                <a href={site.emailHref} className="wipe-link mt-2 inline-block text-[17px] font-semibold text-ink">{site.email}</a>
                <br />
                <a href={site.phoneHref} className="wipe-link mt-1 inline-block text-[17px] font-semibold text-ink">{site.phone}</a>
              </div>
              <div>
                <p className="text-[20px] font-extrabold lowercase text-ink">find us in orbit</p>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                  {site.socials.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="wipe-link text-[16px] font-semibold text-ink/80">
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-mist py-20 max-md:py-12">
          <div className="shell">
            <Reveal y={40}>
              <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 shadow-banner max-md:p-6">
                <p className="mb-6 text-[17px] font-medium leading-relaxed text-ink/60">
                  Questions, ideas, or just want to connect? We&apos;re a message away — let&apos;s keep the conversation and collaboration going.
                </p>
                <FormShell action={site.forms.contact} submitLabel="Send message">
                  <Field label="Name" name="name" required placeholder="Your name" />
                  <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
                    <Field label="Phone" name="phone" type="tel" placeholder="+91" />
                    <Field label="Email" name="email" type="email" required placeholder="you@example.com" />
                  </div>
                  <Field label="Message" name="message" as="textarea" required placeholder="Tell us what's on your mind…" />
                </FormShell>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer site={site} />
    </>
  );
}
