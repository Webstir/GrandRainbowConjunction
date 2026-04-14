import type { Metadata } from "next";
import { Fraunces, Literata, Press_Start_2P } from "next/font/google";
import { GlobalSoundToggle } from "@/components/GlobalSoundToggle";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Literata({
  subsets: ["latin"],
  variable: "--font-body",
});

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: {
    default: "The Grand Rainbow Conjunction",
    template: "%s · The Grand Rainbow Conjunction",
  },
  description:
    "The Grand Rainbow Conjunction — a medicine path through Hollywood, music production, long-haul miles, and life after the darkest frame.",
  openGraph: {
    title: "The Grand Rainbow Conjunction",
    description:
      "Stories and ceremony at The Grand Rainbow Conjunction: a shaman healer’s memoir in motion.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Polyfills + early error trap — runs before any Next.js bundle. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  /* Polyfills for Safari 15.4 APIs that Next 16 uses in its client router.
     DDG's WKWebView on iOS 16.1 may not expose these despite the OS version. */
  if(typeof structuredClone==="undefined"){
    structuredClone=function(v){return JSON.parse(JSON.stringify(v))};
  }
  if(typeof Object.hasOwn==="undefined"){
    Object.hasOwn=function(o,p){return Object.prototype.hasOwnProperty.call(o,p)};
  }
  /* Early error trap: catches parse/runtime errors before React mounts */
  window.__earlyErrors=[];
  window.onerror=function(msg,src,line,col,err){
    window.__earlyErrors.push({msg:msg,src:src,line:line,col:col,stack:err&&err.stack});
    var d=document.getElementById("__early-err");
    if(!d){d=document.createElement("div");d.id="__early-err";d.style.cssText="position:fixed;top:0;left:0;right:0;background:#7f1d1d;color:#fecaca;padding:1rem;font:12px monospace;z-index:99999;white-space:pre-wrap;word-break:break-all;max-height:50vh;overflow:auto";document.body&&document.body.appendChild(d)}
    d.textContent+="JS ERROR: "+msg+"\\n  "+src+":"+line+"\\n"+(err&&err.stack||"")+"\\n\\n";
    return false;
  };
  window.onunhandledrejection=function(e){
    window.onerror&&window.onerror("Unhandled promise rejection: "+(e.reason&&e.reason.message||e.reason),"promise",0,0,e.reason);
  };
})();
            `.trim(),
          }}
        />
      </head>
      <body
        className={`${display.variable} ${body.variable} ${pixel.variable} min-h-screen font-body antialiased`}
      >
        {children}
        <GlobalSoundToggle />
      </body>
    </html>
  );
}
