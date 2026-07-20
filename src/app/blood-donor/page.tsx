import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SplitHeadline from "@/components/SplitHeadline";
import FormShell, { Field } from "@/components/FormShell";
import Reveal from "@/components/Reveal";
import { site, forms } from "@/content/site";

export const metadata: Metadata = {
  title: "Donate Blood",
  description:
    "Register as a blood donor or request blood support through the Rotaract Coimbatore Gaalaxy community network.",
  robots: { index: false, follow: false },
};

export default function BloodDonorPage() {
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
                  Every drop <span className="text-cranberry">✦</span> counts.
                </span>,
              ]}
              className="max-w-4xl text-[140px] font-extrabold leading-[1.06] tracking-tight text-ink max-lg:text-[76px] max-md:text-[48px]"
            />
            <p className="mt-8 max-w-xl text-[17px] font-medium leading-relaxed text-ink/60">
              We bring together willing donors with those in urgent need — a life-saving bridge powered by compassion and community. Register once; help when it matters most.
            </p>
          </div>
        </section>

        <section className="bg-mist py-20 max-md:py-12">
          <div className="shell">
            <Reveal y={40}>
              <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 shadow-banner max-md:p-6">
                <FormShell action={forms.bloodDonor} submitLabel="Register as a donor" accent="cranberry">
                  <Field label="Full name" name="fullName" required placeholder="Your name" />
                  <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
                    <Field label="Email" name="email" type="email" required placeholder="you@example.com" />
                    <Field label="Contact number" name="contactNumber" type="tel" required placeholder="+91" />
                  </div>
                  <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
                    <Field label="Rotaractor or Non-Rotaractor" name="rotaractorStatus" as="select" required placeholder="Select" options={["Rotaractor", "Non-Rotaractor"]} />
                    <Field label="Age / Date of birth" name="dob" required placeholder="DD/MM/YYYY" />
                  </div>
                  <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
                    <Field label="Gender (optional)" name="gender" as="select" placeholder="Select gender" options={["Male", "Female", "Prefer not to say"]} />
                    <Field label="Weight (kg)" name="weight" type="number" required placeholder="e.g. 60" />
                  </div>
                  <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
                    <Field label="Blood group" name="bloodGroup" as="select" required placeholder="Select blood group" options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} />
                    <Field label="City / Area / Address" name="city" required placeholder="Coimbatore" />
                  </div>
                  <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
                    <Field label="Currently willing to donate?" name="willingToDonate" as="select" required placeholder="Select" options={["Yes", "No"]} />
                    <Field label="Donated before?" name="donatedBefore" as="select" required placeholder="Select" options={["Yes", "No"]} />
                  </div>
                  <label className="flex items-start gap-3 text-[15px] font-medium text-ink/70">
                    <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-cranberry" />
                    I agree to be contacted by the club for blood donation purposes and confirm that the information provided is true.
                  </label>
                </FormShell>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-16">
          <div className="shell flex flex-wrap justify-between gap-10">
            <div>
              <p className="text-[20px] font-extrabold lowercase text-ink">urgent need?</p>
              <a href={site.phoneHref} className="wipe-link mt-2 inline-block text-[17px] font-semibold text-ink">{site.phone}</a>
            </div>
            <div>
              <p className="text-[20px] font-extrabold lowercase text-ink">write to us</p>
              <a href={site.emailHref} className="wipe-link mt-2 inline-block text-[17px] font-semibold text-ink">{site.email}</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
