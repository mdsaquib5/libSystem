import { montserrat } from "../fonts/font";
import "./globals.css";

export const metadata = {
  title: "LibSystem | Admin Panel",
  description: "Manage your library system",
};

import AuthGuard from "../components/authGuard";
import { Toaster } from "react-hot-toast";
import Providers from "../components/providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={montserrat.className}>
        <Providers>
          <AuthGuard>
            <Toaster position="top-right" />
            {children}
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}