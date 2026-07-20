import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PillButton } from "@/components/Buttons";

export default function NotFound() {
  return (
    <>
      <Header tone="light" />
      <main className="flex min-h-[80vh] flex-col items-center justify-center pt-32 text-center">
        <p className="text-[120px] font-extrabold leading-none text-ink/10 max-md:text-[80px]">404</p>
        <h1 className="mt-4 text-[42px] font-extrabold text-ink max-md:text-[28px]">
          Lost in space <span className="text-starlight">✦</span>
        </h1>
        <p className="mt-3 max-w-md text-[17px] font-medium text-ink/60">
          This page drifted out of orbit. Head back home and we&apos;ll take it from there.
        </p>
        <div className="mt-8 pb-24">
          <PillButton href="/">Back to Home</PillButton>
        </div>
      </main>
      <Footer />
    </>
  );
}
