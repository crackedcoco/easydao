import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section
        className="border-b border-[#2a2d3a] px-4 pb-14 pt-20 text-center sm:px-6 sm:pb-20 sm:pt-28"
        style={{
          background: "linear-gradient(135deg, #1a1d40 0%, #0f1117 50%, #0d1a1a 100%)",
        }}
      >
        <div className="mx-auto max-w-[600px]">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Create a DAO
          </h1>
          <p className="mt-3 text-lg text-[#8b8fa3]">
            Name it, add members, deploy. One transaction on Base.
          </p>
          <Link
            href="/create"
            className="mt-8 inline-block rounded-lg bg-[#6c7bff] px-10 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#5a6aee]"
          >
            Get Started
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-[600px] px-4 sm:px-6">
        <div className="my-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { number: "1 tx", label: "To deploy" },
            { number: "Base", label: "L2 Chain" },
            { number: "<$0.01", label: "Gas Cost" },
            { number: "0", label: "Code Required" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-[#2a2d3a] bg-[#1a1d27] p-4 text-center">
              <div
                className="text-xl font-bold sm:text-2xl"
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

        <div className="mb-10 text-center text-sm text-[#8b8fa3]">
          <Link href="/docs" className="text-[#6c7bff] transition-colors hover:text-white">
            Read the tutorial
          </Link>
          <span className="mx-2">&middot;</span>
          <Link href="/explore" className="text-[#6c7bff] transition-colors hover:text-white">
            Explore DAOs
          </Link>
        </div>
      </div>
    </>
  );
}
