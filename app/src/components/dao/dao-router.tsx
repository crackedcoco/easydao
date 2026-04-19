"use client";

import { usePathname } from "next/navigation";
import { DAOTabs } from "@/components/dao/dao-tabs";
import DAOOverviewPage from "@/components/dao/pages/overview";
import ProposalsPage from "@/components/dao/pages/proposals";
import NewProposalPage from "@/components/dao/pages/new-proposal";
import ProposalDetailPage from "@/components/dao/pages/proposal-detail";
import TreasuryPage from "@/components/dao/pages/treasury";
import MembersPage from "@/components/dao/pages/members";

export default function DAOCatchAllPage() {
  const pathname = usePathname();

  // Parse: /dao/0x.../proposals/new, /dao/0x.../proposals/123, etc.
  const parts = pathname.split("/").filter(Boolean); // ["dao", "0x...", "proposals", ...]
  const address = parts[1] as `0x${string}` | undefined;

  if (!address) {
    return (
      <div className="mx-auto max-w-[900px] px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-400">No DAO address provided</h1>
        <p className="mt-2 text-[#8b8fa3]">Navigate to /dao/0x... to view a DAO.</p>
      </div>
    );
  }

  const section = parts[2]; // "proposals" | "treasury" | "members" | undefined
  const subSection = parts[3]; // "new" | proposal ID | undefined

  let content: React.ReactNode;

  if (!section) {
    content = <DAOOverviewPage governorAddress={address} />;
  } else if (section === "proposals" && !subSection) {
    content = <ProposalsPage governorAddress={address} />;
  } else if (section === "proposals" && subSection === "new") {
    content = <NewProposalPage governorAddress={address} />;
  } else if (section === "proposals" && subSection) {
    content = <ProposalDetailPage governorAddress={address} proposalId={subSection} />;
  } else if (section === "treasury") {
    content = <TreasuryPage governorAddress={address} />;
  } else if (section === "members") {
    content = <MembersPage governorAddress={address} />;
  } else {
    content = <DAOOverviewPage governorAddress={address} />;
  }

  return <DAOTabs governorAddress={address}>{content}</DAOTabs>;
}
