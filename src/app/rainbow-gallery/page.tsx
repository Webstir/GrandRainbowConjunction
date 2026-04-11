import type { Metadata } from "next";
import { RainbowCaptcha } from "@/components/gate/RainbowCaptcha";

export const metadata: Metadata = {
  title: "Rainbow gallery",
  description:
    "Rainbows from readers of The Grand Rainbow Conjunction — a public wall.",
};

export default function RainbowGalleryPage() {
  return <RainbowCaptcha variant="gallery" />;
}
