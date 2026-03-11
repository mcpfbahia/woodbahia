import "~/styles/globals.css";

import { type Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.woodbahia.site"),
  title: {
    default: "Wood Bahia | Casas Pré-Fabricadas e Chalés de Madeira na Bahia e Sergipe",
    template: "%s | Wood Bahia"
  },
  description: "Líder regional em construção sustentável de chalés e casas de madeira em Pinus tratado. Atendemos Salvador, Litoral Norte, Chapada Diamantina e toda a Bahia e Sergipe. 15 anos de garantia.",
  keywords: [
    "casas pré-fabricadas bahia", 
    "chalés de madeira bahia", 
    "casas de madeira salvador", 
    "construção em madeira bahia",
    "pinus tratado bahia", 
    "wood bahia", 
    "casa de campo bahia", 
    "construção sustentável bahia", 
    "investimento imobiliário bahia", 
    "litoral norte bahia", 
    "casa de madeira sergipe",
    "praia do forte", 
    "guarajuba", 
    "imbassai", 
    "itacimirim",
    "lauro de freitas",
    "camaçari",
    "vitoria da conquista", 
    "feira de santana", 
    "itacaré", 
    "trancoso", 
    "porto seguro",
    "barra grande",
    "morro de sao paulo"
  ].join(", "),
  authors: [{ name: "Wood Bahia" }],
  alternates: {
    canonical: "https://www.woodbahia.site",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Wood Bahia | Casas Pré-Fabricadas e Chalés de Madeira em toda a Bahia",
    description: "Referência em casas de madeira sustentável na Bahia e Sergipe. +100 projetos entregues com alta durabilidade e design premium.",
    url: "https://www.woodbahia.site/",
    siteName: "Wood Bahia",
    images: [
      {
        url: "/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Wood Bahia - Casas e Chalés de Madeira",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wood Bahia | Casas de Madeira na Bahia",
    description: "Construa seu sonho com a Wood Bahia. Especialistas em chalés e casas pré-fabricadas de madeira.",
    images: ["/og-image.jpeg"],
  },
  verification: {
    google: "8DhgGi3RMG7W9JtdOfauMqmcMmXx2_jdlczhKlezqBg",
  },
};

const schemaJSON = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.woodbahia.site/#organization",
      "name": "Wood Bahia",
      "url": "https://www.woodbahia.site/",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://www.woodbahia.site/#logo",
        "url": "https://www.woodbahia.site/logo.png",
        "contentUrl": "https://www.woodbahia.site/logo.png",
        "width": 512,
        "height": 512,
        "caption": "Wood Bahia"
      },
      "image": { "@id": "https://www.woodbahia.site/#logo" },
      "sameAs": [
        "https://www.instagram.com/woodbahiacasasprefabricadas/",
        "https://www.facebook.com/woodbahia"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+55-71-99293-6290",
        "contactType": "sales",
        "areaServed": ["BA", "SE", "BR"],
        "availableLanguage": "Portuguese"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.woodbahia.site/#website",
      "url": "https://www.woodbahia.site/",
      "name": "Wood Bahia - Casas Pré-Fabricadas",
      "publisher": { "@id": "https://www.woodbahia.site/#organization" },
      "inLanguage": "pt-BR"
    },
    {
      "@type": "LocalBusiness",
      "parentOrganization": { "@id": "https://www.woodbahia.site/#organization" },
      "name": "Wood Bahia - Showroom Lauro de Freitas",
      "image": "https://www.woodbahia.site/og-image.jpeg",
      "priceRange": "$$$",
      "telephone": "+55-71-99293-6290",
      "email": "woodbahia@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Rua Roque Jose da Silva 17, Buraquinho",
        "addressLocality": "Lauro de Freitas",
        "addressRegion": "BA",
        "postalCode": "42710-530",
        "addressCountry": "BR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-12.8997267",
        "longitude": "-38.383889"
      },
      "url": "https://www.woodbahia.site/",
      "areaServed": [
        "Salvador", "Lauro de Freitas", "Camaçari", "Feira de Santana", 
        "Vitória da Conquista", "Itabuna", "Ilhéus", "Juazeiro", "Barreiras", 
        "Jequié", "Alagoinhas", "Teixeira de Freitas", "Porto Seguro", 
        "Simões Filho", "Paulo Afonso", "Eunápolis", "Santo Antônio de Jesus", 
        "Valença", "Candeias", "Guanambi", "Jacobina", "Serrinha", 
        "Luis Eduardo Magalhães", "Itapetinga", "Irecê", "Casa Nova", 
        "Bom Jesus da Lapa", "Brumado", "Conceição do Coité", "Itamaraju",
        "Itacaré", "Trancoso", "Arraial d'Ajuda", "Praia do Forte", "Guarajuba",
        "Imbassaí", "Litoral Norte da Bahia", "Chapada Diamantina", "Lençóis",
        "Aracaju, SE", "Estância, SE", "Lagarto, SE", "Itabaiana, SE"
      ],
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Saturday",
          "opens": "08:00",
          "closes": "12:00"
        }
      ],
      "description": "Showroom especializado em casas pré-fabricadas e chalés de madeira sustentável. Referência em toda a Bahia e Sergipe."
    }
  ]
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PK9Q2HQX');` }} />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-JXH847BPW5"></script>
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-JXH847BPW5');` }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJSON) }} />
      </head>
      <body className="font-inter">
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PK9Q2HQX" height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
