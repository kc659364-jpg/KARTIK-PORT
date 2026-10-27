import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";

const About = dynamic(() => import("@/components/sections/About"));
const Services = dynamic(() => import("@/components/sections/Services"));
const Skills = dynamic(() => import("@/components/sections/Skills"));
const Projects = dynamic(() => import("@/components/sections/Projects"));
const Experience = dynamic(() => import("@/components/sections/Experience"));
const WhyWorkWithMe = dynamic(
  () => import("@/components/sections/WhyWorkWithMe"),
);
const Contact = dynamic(() => import("@/components/sections/Contact"));
const Footer = dynamic(() => import("@/components/layout/Footer"));

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Instantly loaded */}
        <Hero />

        {/* Asynchronously loaded in chunks */}
        <About />
        <Services />
        <Skills />
        <Projects />
        <Experience />
        <WhyWorkWithMe />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
