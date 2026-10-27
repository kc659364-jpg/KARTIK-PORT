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

// Yahan tumhara naya SEO Metadata add ho gaya
export const metadata = {
  title: "Best Website Developer Agency | AI Automation Developer",
  description: "Top website developers offering creative digital solutions. We specialize in AI automation, custom web applications, and high-performance modern websites.",
  keywords: [
    "best developer agency",
    "best website developer agency",
    "top website developers",
    "creative website developer",
    "ai automation",
    "ai automation developer",
    "freelance web developer",
    "web development agency",
    "website devloper in surat"
  ],
};

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
