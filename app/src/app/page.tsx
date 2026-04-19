import Link from "next/link";

const stats = [
  { number: "1 tx", label: "To deploy" },
  { number: "Base", label: "L2 Chain" },
  { number: "<$0.01", label: "Gas Cost" },
  { number: "28", label: "Tests Passing" },
];

const features = [
  {
    title: "DAO Creation Wizard",
    desc: "Step-by-step flow deploys token, treasury, and governance contracts in a single transaction.",
  },
  {
    title: "Treasury Management",
    desc: "Shared wallet with full transparency. Funds move only through approved proposals.",
  },
  {
    title: "Proposals & Voting",
    desc: "On-chain governance with For / Against / Abstain voting and configurable quorum.",
  },
  {
    title: "Member Governance",
    desc: "Token-based membership with voting power delegation. Fair and transparent.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="border-b border-[#2a2d3a] px-4 pb-10 pt-14 text-center sm:px-6 sm:pb-12 sm:pt-16"
        style={{
          background:
            "linear-gradient(135deg, #1a1d40 0%, #0f1117 50%, #0d1a1a 100%)",
        }}
      >
        <div className="mx-auto max-w-[900px]">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            EasyDAO
          </h1>
          <p className="mt-2 text-base text-[#8b8fa3] sm:text-lg">
            Create & manage DAOs on Base. No code required.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-[#8b8fa3]">
            <span>Huntington Analytics</span>
            <span>&middot;</span>
            <span>Powered by OpenZeppelin</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[900px] px-4 sm:px-6">
        {/* Stat cards */}
        <div className="my-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-4 text-center"
            >
              <div
                className="text-2xl font-bold"
                style={{
                  background: "linear-gradient(135deg, #6c7bff, #00d4aa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.number}
              </div>
              <div className="mt-1 text-xs text-[#8b8fa3]">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="my-8 flex items-center justify-between rounded-xl border border-[#2a2d3a] bg-[#1a1d27] px-5 py-4">
          <span className="text-sm text-[#8b8fa3]">
            Deploy your DAO in a single transaction
          </span>
          <Link
            href="/create"
            className="rounded-lg bg-[#6c7bff] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5a6aee]"
          >
            Create DAO
          </Link>
        </div>

        {/* Features */}
        <h2 className="mb-4 mt-10 border-b-2 border-[#2a2d3a] pb-2 text-xl font-bold text-white">
          Core Features
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <Link
              key={f.title}
              href="/create"
              className="group rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-5 transition-all hover:border-[#6c7bff]/30 hover:bg-[#1e2130]"
            >
              <h3 className="text-sm font-semibold text-[#6c7bff]">
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#8b8fa3]">
                {f.desc}
              </p>
            </Link>
          ))}
        </div>

        {/* How it works */}
        <h2 className="mb-4 mt-10 border-b-2 border-[#2a2d3a] pb-2 text-xl font-bold text-white">
          How It Works
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">
                  Step
                </th>
                <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">
                  Action
                </th>
                <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "1",
                  "Configure",
                  "Name your DAO, set token symbol, add member addresses and allocations",
                ],
                [
                  "2",
                  "Tune Governance",
                  "Set voting delay, duration, quorum %, proposal threshold, and execution delay",
                ],
                [
                  "3",
                  "Deploy",
                  "One transaction deploys ERC20Votes token, TimelockController treasury, and Governor",
                ],
                [
                  "4",
                  "Govern",
                  "Create proposals, vote on-chain, queue through timelock, execute automatically",
                ],
              ].map(([step, action, details]) => (
                <tr
                  key={step}
                  className="border-b border-[#2a2d3a] transition-colors hover:bg-[#6c7bff]/5"
                >
                  <td className="px-4 py-2.5 font-bold text-white">{step}</td>
                  <td className="px-4 py-2.5 font-medium text-[#00d4aa]">
                    {action}
                  </td>
                  <td className="px-4 py-2.5 text-[#8b8fa3]">{details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Architecture */}
        <h2 className="mb-4 mt-10 border-b-2 border-[#2a2d3a] pb-2 text-xl font-bold text-white">
          Smart Contract Architecture
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              name: "DAOFactory",
              desc: "Deploys complete DAOs via EIP-1167 minimal proxies. Permissionless, ~300K gas.",
              color: "#6c7bff",
            },
            {
              name: "DAOToken",
              desc: "ERC20Votes + Permit. Fixed supply, auto-delegation on mint. No owner.",
              color: "#00d4aa",
            },
            {
              name: "DAOGovernor",
              desc: "OpenZeppelin Governor with configurable settings, simple counting, quorum fraction.",
              color: "#ff6b9d",
            },
            {
              name: "DAOTimelock",
              desc: "TimelockController treasury. Holds ETH + tokens. Proposals execute through it.",
              color: "#8b8fa3",
            },
          ].map((c) => (
            <div
              key={c.name}
              className="rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-5"
            >
              <h3 className="text-sm font-semibold" style={{ color: c.color }}>
                {c.name}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#8b8fa3]">
                {c.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="my-10 text-center">
          <Link
            href="/create"
            className="inline-block rounded-lg bg-[#6c7bff] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5a6aee]"
          >
            Create Your DAO
          </Link>
          <span className="mx-4 text-[#8b8fa3]">or</span>
          <Link
            href="/explore"
            className="inline-block rounded-lg border border-[#2a2d3a] bg-[#1a1d27] px-8 py-3 text-sm font-semibold text-white transition-colors hover:border-[#6c7bff]/30"
          >
            Explore DAOs
          </Link>
        </div>
      </div>
    </>
  );
}
