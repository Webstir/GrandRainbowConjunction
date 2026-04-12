import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GOFUNDME_SAVE_RICO_URL } from "@/lib/support";

export const metadata: Metadata = {
  title: "Support",
  description: "Save Rico Rainbow from homelessness — GoFundMe.",
};

export default function TipPage() {
  redirect(GOFUNDME_SAVE_RICO_URL);
}
