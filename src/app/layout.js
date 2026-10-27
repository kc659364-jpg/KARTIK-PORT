import "./globals.css";
import { SmoothCursor } from "@/registry/magicui/smooth-cursor";
import { ThemeProvider } from "@/context/ThemeContext";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kartik-portfolio.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kartik Chauhan | Web Developer & Creative Technologist",
    template: "%s | Kartik Chauhan",
  },
  description:
    "Portfolio of Kartik Chauhan — a web developer and creative technologist specializing in responsive modern web applications, interactive 3D experiences, and digital business solutions.",
  keywords: [
    "Kartik Chauhan",
    "Web Developer",
    "Frontend Developer",
    "Full Stack Developer",
    "React.js Developer",
    "Next.js Portfolio",
    "Three.js 3D Developer",
    "GSAP Animations",
    "UI/UX Designer",
    "Creative Technologist",
  ],
  authors: [{ name: "Kartik Chauhan", url: siteUrl }],
  creator: "Kartik Chauhan",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Kartik Chauhan Portfolio",
    title: "Kartik Chauhan | Web Developer & Creative Technologist",
    description:
      "Portfolio of Kartik Chauhan — building responsive websites, interactive 3D experiences, and modern web applications.",
    images: [
      {
        url: "/images/kk.png",
        width: 1200,
        height: 630,
        alt: "Kartik Chauhan - Web Developer & Creative Technologist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kartik Chauhan | Web Developer & Creative Technologist",
    description:
      "Portfolio of Kartik Chauhan — building responsive websites, interactive 3D experiences, and modern web applications.",
    images: ["/images/kk.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/images/favicon.svg", type: "image/svg+xml" },
    ],
  },
  verification: {
    google: "mVm-HgXV593-fWaanymPHQRhCaaGQSdlhNIa_21SXls",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Kartik Chauhan",
      url: siteUrl,
      jobTitle: "Web Developer & Creative Technologist",
      description:
        "Web developer and creative technologist specializing in Next.js, React, Three.js, GSAP animations, and scalable full-stack web applications.",
      image: `${siteUrl}/images/kk.png`,
      email: "mailto:kc659364@gmail.com",
      telephone: "+919737275089",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Surat",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
      sameAs: [
        "https://github.com/kartik-chauhan",
        "https://linkedin.com/in/kartik-chauhan-136306343",
        "https://wa.me/919737275089",
      ],
      knowsAbout: [
        "Web Development",
        "Frontend Development",
        "React.js",
        "Next.js",
        "Three.js",
        "GSAP",
        "JavaScript",
        "Tailwind CSS",
        "Node.js",
        "REST APIs",
        "MySQL",
        "PHP",
        "UI/UX Design",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Kartik Chauhan Portfolio",
      description:
        "Official portfolio of Kartik Chauhan showcasing web applications, interactive 3D experiences, and development skills.",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
      inLanguage: "en-US",
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: "Kartik Chauhan | Web Developer & Creative Technologist",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#person`,
      },
      mainEntity: {
        "@id": `${siteUrl}/#person`,
      },
      inLanguage: "en-US",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('app-theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="bg-cream dark:bg-neutral-950 text-espresso dark:text-gray-100 transition-colors duration-200"
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
          <SmoothCursor />
        </ThemeProvider>
      </body>
    </html>
  );
}
