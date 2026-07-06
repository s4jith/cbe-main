import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SplitHeadline from "@/components/SplitHeadline";
import PostCard from "@/components/PostCard";
import CTABanner from "@/components/CTABanner";
import Reveal from "@/components/Reveal";
import { board, generalMembers, voices } from "@/content/members";

export const metadata: Metadata = {
  title: "Stars of Gaalaxy",
  description:
    "Meet the Stars of Gaalaxy — the dedicated board members and Rotaractors of Rotaract Club of Coimbatore Gaalaxy.",
};

export default function TeamPage() {
  const leadership = board.slice(0, 8);
  const rest = board.slice(8);

  return (
    <>
      <Header tone="light" />
      <main>
        <section className="pt-48 pb-16 max-md:pt-32">
          <div className="shell">
            <p className="text-center text-[17px] font-medium lowercase text-ink/40">board members 2025–26</p>
            <SplitHeadline
              as="h1"
              lines={[
                <span key="l1">
                  Stars of <span className="text-starlight">✦</span> Gaalaxy.
                </span>,
              ]}
              className="mt-3 text-center text-[100px] font-extrabold leading-[1.05] tracking-tight text-ink max-lg:text-[64px] max-md:text-[40px]"
            />
          </div>
        </section>

        {/* Leadership */}
        <section className="pb-24">
          <div className="shell grid grid-cols-4 gap-6 max-lg:grid-cols-2">
            {leadership.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.05}>
                <div className="group relative aspect-[3/4] overflow-hidden rounded-3xl shadow-card">
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="(max-width:1024px) 50vw, 280px"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/55" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="text-[18px] font-bold leading-tight text-white">{m.name}</div>
                    <div className="mt-1 text-[13px] font-semibold text-starlight">{m.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Rest of board */}
        <section className="starfield bg-space py-20">
          <div className="shell">
            <SplitHeadline
              lines={["Chairs, advisors,", "and avenue leads."]}
              className="max-w-xl text-[42px] font-extrabold leading-[1.1] text-white max-md:text-[32px]"
            />
            <div className="mt-12 grid grid-cols-4 gap-6 max-lg:grid-cols-3 max-md:grid-cols-2">
              {rest.map((m, i) => (
                <Reveal key={m.name} delay={(i % 4) * 0.05}>
                  <div className="group">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        sizes="(max-width:768px) 50vw, 250px"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]"
                      />
                    </div>
                    <div className="mt-3 text-[16px] font-bold leading-tight text-white">{m.name}</div>
                    <div className="mt-0.5 text-[13px] font-semibold text-white/50">{m.role}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Constellation — general members */}
        <section className="bg-mist py-24 max-md:py-16">
          <div className="shell">
            <SplitHeadline
              lines={["The constellation."]}
              className="text-[42px] font-extrabold leading-[1.1] text-ink max-md:text-[32px]"
            />
            <p className="mt-4 max-w-lg text-[17px] font-medium text-ink/60">
              Eighteen more stars — the general members whose energy powers every project.
            </p>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-10 max-md:gap-x-4">
              {generalMembers.map((m, i) => (
                <Reveal key={m.name} delay={(i % 6) * 0.04} y={30}>
                  <div className="group flex w-32 flex-col items-center text-center max-md:w-24">
                    <div className={`relative h-24 w-24 overflow-hidden rounded-full shadow-card transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 max-md:h-18 max-md:w-18 ${i % 3 === 1 ? "mt-6" : i % 3 === 2 ? "mt-2" : ""}`}>
                      <Image src={m.image} alt={m.name} fill sizes="96px" className="object-cover" />
                    </div>
                    <span className="mt-3 text-[13px] font-bold leading-tight text-ink/80">{m.name}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Voices */}
        <section className="bg-mist pb-24">
          <div className="shell">
            <SplitHeadline
              lines={["In their", "own words."]}
              className="max-w-xl text-[42px] font-extrabold leading-[1.1] text-ink max-md:text-[32px]"
            />
            <div className="mt-12 grid grid-cols-3 gap-8 max-lg:grid-cols-1">
              {voices.map((v, i) => (
                <PostCard key={v.name} quote={v.quote} name={v.name} role={v.role} image={v.image} drift={[-40, 0, -18][i]} />
              ))}
            </div>
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
