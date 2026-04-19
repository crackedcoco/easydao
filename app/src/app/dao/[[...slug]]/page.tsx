import DAORouter from "@/components/dao/dao-router";

export function generateStaticParams() {
  return [{ slug: [""] }];
}

export default function DAOPage() {
  return <DAORouter />;
}
