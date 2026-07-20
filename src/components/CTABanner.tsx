import Reveal from "@/components/Reveal";
import { PillButton, ArrowButton } from "@/components/Buttons";

export default function CTABanner() {
  return (
    <section className="bg-gradient-to-b from-[#10121f] to-space-deep py-18">
      <div className="shell">
        <Reveal>
          <div className="rounded-2xl bg-gradient-to-b from-space to-transparent px-16 pb-20 pt-16 shadow-banner max-md:px-6 max-md:pb-12 max-md:pt-10">
            <span className="text-5xl text-starlight drop-shadow-[0_4px_20px_rgba(255,216,77,0.35)]">✦</span>
            <h2 className="mt-6 max-w-xl text-[42px] font-extrabold leading-[1.1] text-white max-md:text-[32px]">
              Every change begins with a choice.
            </h2>
            <p className="mt-4 max-w-lg text-[17px] font-medium leading-relaxed text-white/65">
              Become part of a community where service, leadership, and friendship come together — or save a life without joining anything at all.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <PillButton href="/join">Join Us</PillButton>
              <ArrowButton href="/blood-donor" variant="light">Become a Blood Donor</ArrowButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
