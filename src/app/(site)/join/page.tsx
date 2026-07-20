import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SplitHeadline from "@/components/SplitHeadline";
import FormShell, { Field } from "@/components/FormShell";
import Reveal from "@/components/Reveal";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Join Us",
  description:
    "Apply to join Rotaract Coimbatore Gaalaxy and become part of a youth-led service and leadership community.",
  robots: { index: false, follow: false },
};

export default async function JoinPage() {
  const site = await getSiteSettings();
  return (
    <>
      <Header tone="light" />
      <main>
        <section className="pt-52 pb-16 max-md:pt-32">
          <div className="shell">
            <SplitHeadline
              as="h1"
              lines={[
                <span key="l1">
                  Ready to <span className="text-starlight">✦</span> rise?
                </span>,
              ]}
              className="max-w-3xl text-[140px] font-extrabold leading-[1.06] tracking-tight text-ink max-lg:text-[76px] max-md:text-[52px]"
            />
            <p className="mt-8 text-[20px] font-extrabold lowercase text-ink/70">
              join a force of 42 (and counting)
            </p>
            <p className="mt-2 max-w-xl text-[17px] font-medium leading-relaxed text-ink/60">
              Become part of a network of motivated individuals driven by leadership, community, and impact. Let&apos;s make a difference — together.
            </p>
          </div>
        </section>

        <section className="bg-mist py-20 max-md:py-12">
          <div className="shell">
            <Reveal y={40}>
              <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 shadow-banner max-md:p-6">
                <FormShell action={site.forms.join} submitLabel="Submit application">
                  <Field label="Full name" name="fullName" required placeholder="Your name" />
                  <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
                    <Field label="Date of birth / Age" name="dob" required placeholder="DD/MM/YYYY" />
                    <Field label="Gender (optional)" name="gender" as="select" placeholder="Select gender" options={["Male", "Female", "Prefer not to say"]} />
                  </div>
                  <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
                    <Field label="Phone" name="phone" type="tel" required placeholder="+91" />
                    <Field label="Email" name="email" type="email" required placeholder="you@example.com" />
                  </div>
                  <Field label="City / Area / Address" name="city" required placeholder="Coimbatore" />
                  <Field label="Occupation / Educational status" name="occupation" required placeholder="Student, professional…" />
                  <Field label="Institution / Organization (if applicable)" name="institution" placeholder="Name of institution" />
                  <Field label="Reason for joining / Interest area" name="reason" as="textarea" required placeholder="What draws you to Rotaract?" />
                  <Field label="How did you hear about the club?" name="hearAbout" placeholder="Instagram, a friend…" />
                  <label className="flex items-start gap-3 text-[15px] font-medium text-ink/70">
                    <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-starlight" />
                    I confirm that the information provided is true and consent to be contacted by the club.
                  </label>
                </FormShell>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-16">
          <div className="shell flex flex-wrap justify-between gap-10">
            <div>
              <p className="text-[20px] font-extrabold lowercase text-ink">we&apos;re always here to chat</p>
              <a href={site.emailHref} className="wipe-link mt-2 inline-block text-[17px] font-semibold text-ink">{site.email}</a>
            </div>
            <div>
              <p className="text-[20px] font-extrabold lowercase text-ink">or just call</p>
              <a href={site.phoneHref} className="wipe-link mt-2 inline-block text-[17px] font-semibold text-ink">{site.phone}</a>
            </div>
          </div>
        </section>
      </main>
      <Footer site={site} />
    </>
  );
}
