export function Footer() {
  return (
    <footer className="border-t border-[#2a2d3a] bg-[#0f1117]">
      <div className="mx-auto max-w-[900px] px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-[#8b8fa3]">
            Huntington Analytics &middot; EasyDAO
          </p>
          <div className="flex gap-6">
            <a
              href="https://notebooklm.huntington-analytics.com"
              className="text-xs text-[#8b8fa3] transition-colors hover:text-[#6c7bff]"
            >
              Research Hub
            </a>
            <a
              href="https://base.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#8b8fa3] transition-colors hover:text-[#00d4aa]"
            >
              Built on Base
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
