
"use client";

import { motion } from "framer-motion";

const WhatsAppIcon = () => (
  <svg
    viewBox="0 0 32 32"
    fill="currentColor"
    className="h-7 w-7 md:h-8 md:w-8"
  >
    <path d="M16.002 0C7.165 0 0 7.163 0 16.001c0 2.82.736 5.579 2.137 8.012L.076 32l8.19-2.148A15.915 15.915 0 0016.002 32C24.839 32 32 24.837 32 16.001 32 7.163 24.839 0 16.002 0zm0 29.367a13.308 13.308 0 01-6.788-1.86l-.486-.289-5.038 1.323 1.347-4.92-.317-.505a13.28 13.28 0 01-2.037-7.115c0-7.361 5.99-13.35 13.35-13.35 7.362 0 13.352 5.989 13.352 13.35 0 7.362-5.99 13.366-13.383 13.366z" />
    <path d="M23.29 19.293c-.345-.172-2.04-1.007-2.357-1.122-.316-.115-.547-.172-.777.173-.23.344-.893 1.122-1.095 1.352-.201.23-.403.258-.748.086-.345-.172-1.456-.537-2.773-1.711-1.025-.914-1.717-2.043-1.918-2.388-.201-.345-.022-.531.151-.703.155-.155.345-.403.517-.604.172-.201.23-.345.345-.575.115-.23.058-.431-.029-.604-.086-.172-.777-1.873-1.065-2.564-.28-.673-.564-.582-.777-.593-.201-.01-.431-.012-.661-.012-.23 0-.604.086-.92.43-.317.345-1.208 1.18-1.208 2.88s1.237 3.34 1.409 3.571c.172.23 2.433 3.716 5.895 5.212.824.356 1.467.568 1.969.727.827.263 1.58.226 2.175.137.663-.099 2.04-.834 2.328-1.64.287-.805.287-1.495.201-1.639-.086-.143-.316-.23-.661-.402z" />
  </svg>
);

export const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/5571992936290?text=Olá! Gostaria de saber mais sobre os chalés da Wood Bahia."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 group md:bottom-6 md:right-6"
      aria-label="Fale conosco pelo WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
    >
      <div className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="relative rounded-lg bg-foreground px-3 py-2 text-sm font-medium whitespace-nowrap text-background shadow-lg">
          Fale conosco
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-foreground"></div>
        </div>
      </div>

      <div className="relative">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30"></span>
        <span className="absolute inset-0 animate-pulse rounded-full bg-[#25D366] opacity-20" style={{ animationDelay: "0.5s" }}></span>

        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[#25D366]/40 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#22c55e] hover:shadow-[#25D366]/50 hover:shadow-xl md:h-16 md:w-16">
          <WhatsAppIcon />
        </div>
      </div>
    </motion.a>
  );
};
