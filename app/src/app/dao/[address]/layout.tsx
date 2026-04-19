import { DAOTabs } from "@/components/dao/dao-tabs";

export default async function DAOLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  return <DAOTabs governorAddress={address}>{children}</DAOTabs>;
}
