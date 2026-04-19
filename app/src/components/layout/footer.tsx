export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            EasyDAO — Decentralized governance made simple
          </p>
          <div className="flex gap-6">
            <a
              href="https://base.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 transition-colors hover:text-gray-300"
            >
              Built on Base
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
