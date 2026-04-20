import Link from "next/link";

export default function DocsPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="border-b border-[#2a2d3a] px-4 pb-10 pt-14 text-center sm:px-6"
        style={{
          background: "linear-gradient(135deg, #1a1d40 0%, #0f1117 50%, #0d1a1a 100%)",
        }}
      >
        <div className="mx-auto max-w-[900px]">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            EasyDAO Tutorial
          </h1>
          <p className="mt-2 text-base text-[#8b8fa3]">
            Complete guide to creating and managing a DAO on Base
          </p>
          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-[#8b8fa3]">
            <span>Huntington Analytics</span>
            <span>&middot;</span>
            <span>Updated: April 2026</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-6">
        {/* Download bar */}
        <div className="mb-8 flex items-center justify-between rounded-xl border border-[#2a2d3a] bg-[#1a1d27] px-5 py-3">
          <span className="text-sm text-[#8b8fa3]">Ready to start?</span>
          <Link
            href="/create"
            className="rounded-lg bg-[#6c7bff] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5a6aee]"
          >
            Create a DAO Now
          </Link>
        </div>

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { number: "5 min", label: "Setup Time" },
            { number: "1", label: "Transaction" },
            { number: "<$0.01", label: "Total Cost" },
            { number: "0", label: "Code Required" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-4 text-center">
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

        {/* Table of Contents */}
        <div className="mb-8 rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-6">
          <h3 className="mb-3 text-sm font-semibold text-[#8b8fa3]">Table of Contents</h3>
          <ol className="space-y-1.5 text-sm">
            {[
              ["what-is-a-dao", "What Is a DAO?"],
              ["prerequisites", "Prerequisites"],
              ["step-1", "Step 1 — Name Your DAO & Token"],
              ["step-2", "Step 2 — Add Members"],
              ["step-3", "Step 3 — Configure Governance"],
              ["step-4", "Step 4 — Review & Deploy"],
              ["proposals", "Creating & Voting on Proposals"],
              ["treasury", "Managing the Treasury"],
              ["delegation", "Delegating Voting Power"],
              ["governance-params", "Governance Parameter Guide"],
              ["architecture", "Smart Contract Architecture"],
              ["faq", "FAQ"],
            ].map(([id, title]) => (
              <li key={id}>
                <a href={`#${id}`} className="text-[#6c7bff] transition-colors hover:text-white">
                  {title}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* --- Content --- */}

        <article className="space-y-0">
          {/* What Is a DAO */}
          <h2 id="what-is-a-dao" className="mb-4 mt-10 border-b-2 border-[#2a2d3a] pb-2 text-xl font-bold text-white">
            What Is a DAO?
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-[#e2e4ea]">
            A <strong className="text-white">DAO</strong> (Decentralized Autonomous Organization) is a group that
            manages shared funds and makes decisions through on-chain voting instead of a traditional hierarchy.
            Think of it as a <strong className="text-white">digital co-op</strong> with a built-in bank account
            that nobody can access without a group vote.
          </p>
          <p className="mb-4 text-sm leading-relaxed text-[#e2e4ea]">
            EasyDAO lets you create a fully functional DAO in minutes with:
          </p>
          <ul className="mb-6 ml-5 list-disc space-y-1 text-sm text-[#e2e4ea]">
            <li>A <strong className="text-white">governance token</strong> — represents membership and voting power</li>
            <li>A <strong className="text-white">shared treasury</strong> — holds ETH and tokens, controlled by votes</li>
            <li>A <strong className="text-white">proposal system</strong> — anyone can suggest actions, members vote</li>
            <li>A <strong className="text-white">timelock</strong> — safety delay before executed proposals take effect</li>
          </ul>

          {/* Prerequisites */}
          <h2 id="prerequisites" className="mb-4 mt-10 border-b-2 border-[#2a2d3a] pb-2 text-xl font-bold text-white">
            Prerequisites
          </h2>
          <p className="mb-4 text-sm text-[#e2e4ea]">
            Before creating a DAO, you need:
          </p>
          <div className="overflow-x-auto">
            <table className="mb-6 w-full text-sm">
              <thead>
                <tr>
                  <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">Requirement</th>
                  <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">Details</th>
                  <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">How to Get It</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Crypto Wallet", "MetaMask, Coinbase Wallet, or Rainbow", "Install from your browser's extension store"],
                  ["Base Network", "Your wallet must be connected to Base (chain ID 8453)", "Add Base via chainlist.org or the app will prompt you"],
                  ["ETH on Base", "A small amount for gas fees (< $0.01 per transaction)", "Bridge from Ethereum mainnet or buy directly on Base"],
                  ["Member Addresses", "Wallet addresses for each DAO member", "Each member shares their 0x... address with you"],
                ].map(([req, details, how]) => (
                  <tr key={req} className="border-b border-[#2a2d3a] transition-colors hover:bg-[#6c7bff]/5">
                    <td className="px-4 py-2.5 font-medium text-white">{req}</td>
                    <td className="px-4 py-2.5 text-[#8b8fa3]">{details}</td>
                    <td className="px-4 py-2.5 text-[#00d4aa]">{how}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Step 1 */}
          <h2 id="step-1" className="mb-4 mt-10 border-b-2 border-[#2a2d3a] pb-2 text-xl font-bold text-white">
            Step 1 — Name Your DAO & Token
          </h2>
          <p className="mb-4 text-sm text-[#e2e4ea]">
            Navigate to the <Link href="/create" className="text-[#6c7bff] hover:text-white">Create page</Link> and
            fill in:
          </p>
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-5">
              <h4 className="text-sm font-semibold text-[#00d4aa]">DAO Name</h4>
              <p className="mt-1.5 text-sm text-[#8b8fa3]">
                The name of your organization. This is also used as the governance token name.
                Example: <code className="text-[#6c7bff]">&quot;Acme DAO&quot;</code>
              </p>
            </div>
            <div className="rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-5">
              <h4 className="text-sm font-semibold text-[#00d4aa]">Token Symbol</h4>
              <p className="mt-1.5 text-sm text-[#8b8fa3]">
                A short ticker symbol (like a stock ticker) for your governance token.
                Example: <code className="text-[#6c7bff]">&quot;ACME&quot;</code>
              </p>
            </div>
          </div>
          <div className="mb-6 rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-4">
            <p className="text-xs text-[#8b8fa3]">
              <strong className="text-[#ff6b9d]">Tip:</strong> Choose a name that clearly identifies your group.
              The token symbol should be 3-5 uppercase letters. Both are permanent and cannot be changed after deployment.
            </p>
          </div>

          {/* Step 2 */}
          <h2 id="step-2" className="mb-4 mt-10 border-b-2 border-[#2a2d3a] pb-2 text-xl font-bold text-white">
            Step 2 — Add Members
          </h2>
          <p className="mb-4 text-sm text-[#e2e4ea]">
            Add the wallet address and token allocation for each founding member. Tokens represent
            <strong className="text-white"> voting power</strong> — whoever holds more tokens has more influence in votes.
          </p>
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-5">
              <h4 className="text-sm font-semibold text-[#00d4aa]">Wallet Address</h4>
              <p className="mt-1.5 text-sm text-[#8b8fa3]">
                Each member&apos;s Ethereum address (starts with <code className="text-[#6c7bff]">0x</code>).
                Must be a valid 42-character hex address.
              </p>
            </div>
            <div className="rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-5">
              <h4 className="text-sm font-semibold text-[#00d4aa]">Token Amount</h4>
              <p className="mt-1.5 text-sm text-[#8b8fa3]">
                How many governance tokens this member receives. Equal amounts = equal voting power.
                You can allocate unevenly for weighted governance.
              </p>
            </div>
          </div>
          <div className="mb-6 rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-4">
            <p className="text-xs text-[#8b8fa3]">
              <strong className="text-[#ff6b9d]">Important:</strong> The total token supply is fixed at creation.
              No new tokens can be minted after deployment. Plan your distribution carefully.
              Maximum 200 members per DAO.
            </p>
          </div>
          <p className="mb-6 text-sm text-[#e2e4ea]">
            <strong className="text-white">Example distributions:</strong>
          </p>
          <div className="overflow-x-auto">
            <table className="mb-6 w-full text-sm">
              <thead>
                <tr>
                  <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">Pattern</th>
                  <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">Setup</th>
                  <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">Best For</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Equal shares", "100,000 tokens each", "Friend groups, clubs, co-ops"],
                  ["Weighted", "Founder: 500k, Others: 100k each", "Startups, project teams"],
                  ["Contribution-based", "Proportional to investment or work", "Investment DAOs, grants"],
                ].map(([pattern, setup, best]) => (
                  <tr key={pattern} className="border-b border-[#2a2d3a] transition-colors hover:bg-[#6c7bff]/5">
                    <td className="px-4 py-2.5 font-medium text-white">{pattern}</td>
                    <td className="px-4 py-2.5 text-[#8b8fa3]">{setup}</td>
                    <td className="px-4 py-2.5 text-[#00d4aa]">{best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Step 3 */}
          <h2 id="step-3" className="mb-4 mt-10 border-b-2 border-[#2a2d3a] pb-2 text-xl font-bold text-white">
            Step 3 — Configure Governance
          </h2>
          <p className="mb-4 text-sm text-[#e2e4ea]">
            Set the rules for how your DAO makes decisions. Each parameter has a slider with sensible defaults
            — you can leave them as-is for a standard setup, or customize for your needs.
          </p>
          <div className="overflow-x-auto">
            <table className="mb-6 w-full text-sm">
              <thead>
                <tr>
                  <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">Parameter</th>
                  <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">Default</th>
                  <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">What It Does</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Voting Delay", "~4 hours", "Review period before voting starts. Gives members time to read and discuss proposals."],
                  ["Voting Duration", "~7 days", "How long members can cast votes. Longer = more inclusive. Shorter = faster decisions."],
                  ["Quorum", "4%", "Minimum % of total tokens that must vote for a proposal to be valid. Prevents low-turnout decisions."],
                  ["Proposal Threshold", "Any holder", "Minimum tokens needed to create a proposal. Set to 0 lets anyone propose. Higher values prevent spam."],
                  ["Execution Delay", "1 day", "Mandatory waiting period after a vote passes. Safety buffer for members to exit if they disagree."],
                ].map(([param, def, what]) => (
                  <tr key={param} className="border-b border-[#2a2d3a] transition-colors hover:bg-[#6c7bff]/5">
                    <td className="px-4 py-2.5 font-medium text-white">{param}</td>
                    <td className="px-4 py-2.5 text-[#00d4aa]">{def}</td>
                    <td className="px-4 py-2.5 text-[#8b8fa3]">{what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Step 4 */}
          <h2 id="step-4" className="mb-4 mt-10 border-b-2 border-[#2a2d3a] pb-2 text-xl font-bold text-white">
            Step 4 — Review & Deploy
          </h2>
          <p className="mb-4 text-sm text-[#e2e4ea]">
            Review all your settings on the summary screen. When ready:
          </p>
          <ol className="mb-6 ml-5 list-decimal space-y-2 text-sm text-[#e2e4ea]">
            <li>Click <strong className="text-white">&quot;Connect Wallet&quot;</strong> in the top-right corner</li>
            <li>Select your wallet (MetaMask, Coinbase Wallet, etc.)</li>
            <li>Make sure you&apos;re connected to <strong className="text-white">Base</strong> network</li>
            <li>Click <strong className="text-white">&quot;Deploy DAO&quot;</strong></li>
            <li>Confirm the transaction in your wallet</li>
            <li>Wait for the transaction to be confirmed (~2 seconds on Base)</li>
            <li>You&apos;ll be automatically redirected to your new DAO&apos;s dashboard</li>
          </ol>
          <div className="mb-6 rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-4">
            <p className="text-xs text-[#8b8fa3]">
              <strong className="text-[#00d4aa]">What happens behind the scenes:</strong> A single transaction
              deploys three smart contracts — your governance token (ERC20Votes), a treasury (TimelockController),
              and a governor (OpenZeppelin Governor). All members receive their tokens with voting power
              automatically activated. Total gas cost is typically under $0.01 on Base.
            </p>
          </div>

          {/* Proposals */}
          <h2 id="proposals" className="mb-4 mt-10 border-b-2 border-[#2a2d3a] pb-2 text-xl font-bold text-white">
            Creating & Voting on Proposals
          </h2>
          <p className="mb-4 text-sm text-[#e2e4ea]">
            Proposals are how your DAO makes decisions and moves funds. Any token holder (or any holder above the
            proposal threshold) can create one.
          </p>
          <h3 className="mb-3 mt-6 text-sm font-semibold text-[#6c7bff]">Creating a Proposal</h3>
          <ol className="mb-6 ml-5 list-decimal space-y-2 text-sm text-[#e2e4ea]">
            <li>Navigate to your DAO &rarr; <strong className="text-white">Proposals</strong> tab</li>
            <li>Click <strong className="text-white">&quot;New Proposal&quot;</strong></li>
            <li>Fill in the <strong className="text-white">title</strong> and <strong className="text-white">description</strong> — explain what you want to do and why</li>
            <li>Set the <strong className="text-white">target address</strong> — who or what contract the proposal affects</li>
            <li>Set the <strong className="text-white">ETH amount</strong> if you&apos;re transferring funds from the treasury</li>
            <li>Click <strong className="text-white">&quot;Submit Proposal&quot;</strong> and confirm in your wallet</li>
          </ol>

          <h3 className="mb-3 mt-6 text-sm font-semibold text-[#6c7bff]">Proposal Lifecycle</h3>
          <div className="overflow-x-auto">
            <table className="mb-6 w-full text-sm">
              <thead>
                <tr>
                  <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">State</th>
                  <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">Duration</th>
                  <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">What Happens</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Pending", "Voting Delay period", "Members review and discuss before voting begins"],
                  ["Active", "Voting Duration period", "Members cast votes: For, Against, or Abstain"],
                  ["Succeeded", "—", "Vote passed (more For than Against, quorum met). Ready to queue."],
                  ["Queued", "Execution Delay period", "Waiting in the timelock. Safety period for objectors to exit."],
                  ["Executed", "—", "The proposal's action has been carried out (e.g., funds transferred)"],
                  ["Defeated", "—", "Vote failed (more Against, or quorum not met). No action taken."],
                ].map(([state, dur, what]) => (
                  <tr key={state} className="border-b border-[#2a2d3a] transition-colors hover:bg-[#6c7bff]/5">
                    <td className="px-4 py-2.5 font-medium text-white">{state}</td>
                    <td className="px-4 py-2.5 text-[#00d4aa]">{dur}</td>
                    <td className="px-4 py-2.5 text-[#8b8fa3]">{what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mb-3 mt-6 text-sm font-semibold text-[#6c7bff]">Voting</h3>
          <p className="mb-6 text-sm text-[#e2e4ea]">
            During the <strong className="text-white">Active</strong> period, members vote by clicking
            <strong className="text-[#00d4aa]"> Vote For</strong>,
            <strong className="text-[#ff6b9d]"> Vote Against</strong>, or
            <strong className="text-white"> Abstain</strong>.
            Voting power is proportional to token holdings at the time the proposal was created.
            Each member can only vote once per proposal.
          </p>

          {/* Treasury */}
          <h2 id="treasury" className="mb-4 mt-10 border-b-2 border-[#2a2d3a] pb-2 text-xl font-bold text-white">
            Managing the Treasury
          </h2>
          <p className="mb-4 text-sm text-[#e2e4ea]">
            Your DAO&apos;s treasury is a <strong className="text-white">TimelockController</strong> smart contract
            that holds ETH and ERC-20 tokens. Nobody — not even the creator — can withdraw funds without a passed proposal.
          </p>
          <ul className="mb-6 ml-5 list-disc space-y-1 text-sm text-[#e2e4ea]">
            <li><strong className="text-white">Depositing:</strong> Send ETH or tokens directly to the timelock address (shown on the Treasury page)</li>
            <li><strong className="text-white">Withdrawing:</strong> Create a proposal with the recipient address and amount. If it passes, funds transfer automatically after the execution delay.</li>
            <li><strong className="text-white">Viewing:</strong> The Treasury tab shows current ETH balance and asset list</li>
          </ul>

          {/* Delegation */}
          <h2 id="delegation" className="mb-4 mt-10 border-b-2 border-[#2a2d3a] pb-2 text-xl font-bold text-white">
            Delegating Voting Power
          </h2>
          <p className="mb-4 text-sm text-[#e2e4ea]">
            Delegation lets you assign your voting power to someone else. They vote on your behalf — you keep your tokens.
          </p>
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-5">
              <h4 className="text-sm font-semibold text-[#00d4aa]">To Delegate</h4>
              <p className="mt-1.5 text-sm text-[#8b8fa3]">
                Go to Members tab &rarr; enter the delegate&apos;s address &rarr; click Delegate.
                Your voting power transfers immediately.
              </p>
            </div>
            <div className="rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-5">
              <h4 className="text-sm font-semibold text-[#00d4aa]">To Reclaim</h4>
              <p className="mt-1.5 text-sm text-[#8b8fa3]">
                Click &quot;Delegate to myself&quot; to take back your voting power.
                Takes effect immediately.
              </p>
            </div>
          </div>
          <div className="mb-6 rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-4">
            <p className="text-xs text-[#8b8fa3]">
              <strong className="text-[#ff6b9d]">Note:</strong> EasyDAO automatically delegates each member&apos;s
              voting power to themselves at creation. You don&apos;t need to do anything for voting to work immediately.
              Delegation is only needed if you want someone else to vote for you.
            </p>
          </div>

          {/* Governance Parameters */}
          <h2 id="governance-params" className="mb-4 mt-10 border-b-2 border-[#2a2d3a] pb-2 text-xl font-bold text-white">
            Governance Parameter Guide
          </h2>
          <p className="mb-4 text-sm text-[#e2e4ea]">
            Choosing the right governance parameters depends on your group size, activity level, and trust model.
          </p>
          <div className="overflow-x-auto">
            <table className="mb-6 w-full text-sm">
              <thead>
                <tr>
                  <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">Scenario</th>
                  <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">Voting Delay</th>
                  <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">Voting Duration</th>
                  <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">Quorum</th>
                  <th className="border-b-2 border-[#6c7bff] bg-[#1a1d27] px-4 py-3 text-left font-semibold text-[#6c7bff]">Execution Delay</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Small team (3-10)", "1 hour", "3 days", "20-30%", "1 hour"],
                  ["Community (10-50)", "1 day", "5-7 days", "10-15%", "1 day"],
                  ["Large org (50+)", "2-3 days", "7-14 days", "4-8%", "2-3 days"],
                  ["High-security treasury", "3-7 days", "14 days", "15-25%", "7 days"],
                ].map(([scenario, delay, dur, quorum, exec]) => (
                  <tr key={scenario} className="border-b border-[#2a2d3a] transition-colors hover:bg-[#6c7bff]/5">
                    <td className="px-4 py-2.5 font-medium text-white">{scenario}</td>
                    <td className="px-4 py-2.5 text-[#8b8fa3]">{delay}</td>
                    <td className="px-4 py-2.5 text-[#8b8fa3]">{dur}</td>
                    <td className="px-4 py-2.5 text-[#00d4aa]">{quorum}</td>
                    <td className="px-4 py-2.5 text-[#8b8fa3]">{exec}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Architecture */}
          <h2 id="architecture" className="mb-4 mt-10 border-b-2 border-[#2a2d3a] pb-2 text-xl font-bold text-white">
            Smart Contract Architecture
          </h2>
          <p className="mb-4 text-sm text-[#e2e4ea]">
            EasyDAO deploys battle-tested <strong className="text-white">OpenZeppelin v5</strong> contracts on
            <strong className="text-white"> Base</strong> (Ethereum L2). Every DAO consists of four contracts:
          </p>
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            {[
              { name: "DAOFactory", desc: "Singleton factory that deploys new DAOs via EIP-1167 minimal proxies (clones). One transaction creates all three contracts below. Permissionless — anyone can call it.", color: "#6c7bff" },
              { name: "DAOToken (ERC20Votes)", desc: "Governance token with built-in voting power tracking (ERC20Votes) and gasless approvals (ERC2612 Permit). Fixed supply, no owner, no minting after creation.", color: "#00d4aa" },
              { name: "DAOGovernor", desc: "OpenZeppelin Governor with configurable settings (delay, period, quorum, threshold), simple For/Against/Abstain counting, and timelock-controlled execution.", color: "#ff6b9d" },
              { name: "DAOTimelock", desc: "TimelockController that serves as the treasury. Holds ETH and tokens. Only the Governor can queue proposals. Anyone can execute after the delay.", color: "#8b8fa3" },
            ].map((c) => (
              <div key={c.name} className="rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-5">
                <h4 className="text-sm font-semibold" style={{ color: c.color }}>{c.name}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-[#8b8fa3]">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="mb-6 rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-4">
            <p className="text-xs text-[#8b8fa3]">
              <strong className="text-[#00d4aa]">Security:</strong> All contracts are audited, use
              <code className="text-[#6c7bff]"> _disableInitializers()</code> to prevent implementation takeover,
              and enforce minimum governance parameters (voting delay &ge; 1 block, timelock delay &ge; 1 hour,
              voting period &ge; ~1 day, max 200 recipients). 28 tests cover the full governance lifecycle.
            </p>
          </div>

          {/* FAQ */}
          <h2 id="faq" className="mb-4 mt-10 border-b-2 border-[#2a2d3a] pb-2 text-xl font-bold text-white">
            FAQ
          </h2>
          {[
            ["How much does it cost to create a DAO?", "Under $0.01 in gas fees on Base. There are no platform fees — the contracts are free and open-source."],
            ["Can I add members later?", "Token supply is fixed at creation. To add new members, existing members can transfer tokens to them, or the DAO can create a proposal to do so."],
            ["Can governance parameters be changed?", "Yes — through a governance proposal. The GovernorSettings contract allows changing voting delay, period, and threshold via on-chain votes."],
            ["What happens if I lose access to my wallet?", "Your voting power is tied to your wallet. If you lose access, you lose your tokens and voting power. Use a secure wallet with backup."],
            ["Is there a UI for watching proposals?", "The Proposals tab shows all proposals. In the current version, proposals are loaded from on-chain events when the contracts are deployed."],
            ["Can I use this for a real organization?", "The smart contracts are production-ready (OpenZeppelin v5, audited patterns). However, DAOs exist in a legal gray area in most jurisdictions. Consider a legal wrapper (Wyoming DAO LLC, Marshall Islands) for formal organizations."],
            ["What chain is this on?", "Base — an Ethereum L2 by Coinbase. It offers near-instant finality (~2 second blocks) and extremely low gas fees while inheriting Ethereum's security."],
          ].map(([q, a]) => (
            <div key={q} className="mb-4">
              <h3 className="text-sm font-semibold text-[#6c7bff]">{q}</h3>
              <p className="mt-1 text-sm text-[#8b8fa3]">{a}</p>
            </div>
          ))}

          {/* Sources */}
          <div className="mt-10 rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-5">
            <h3 className="mb-2 text-sm font-semibold text-[#8b8fa3]">References & Resources</h3>
            <ul className="columns-2 gap-8 text-xs text-[#8b8fa3]">
              <li className="mb-1">OpenZeppelin Governor Docs</li>
              <li className="mb-1">EIP-1167: Minimal Proxy</li>
              <li className="mb-1">ERC20Votes (EIP-5805)</li>
              <li className="mb-1">Base Documentation</li>
              <li className="mb-1">Compound Governor Framework</li>
              <li className="mb-1">Foundry Book</li>
            </ul>
          </div>
        </article>

        {/* Bottom CTA */}
        <div className="my-10 text-center">
          <Link
            href="/create"
            className="inline-block rounded-lg bg-[#6c7bff] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5a6aee]"
          >
            Create Your DAO
          </Link>
        </div>
      </div>
    </>
  );
}
