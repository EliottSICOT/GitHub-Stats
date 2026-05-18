export default function Footer() {
  return (
    <footer className="mt-16 pt-6 border-t border-border">
      <div className="font-mono text-xs text-text-muted space-y-2 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
        <div>
          <span className="text-accent">$</span> built by{' '}
          <a
            href="https://eliottsicot.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text hover:text-accent transition-colors underline-offset-2 hover:underline"
          >
            Eliott Sicot
          </a>
          <span className="text-text-muted"> — founder of </span>
          <a
            href="https://upnet.solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text hover:text-accent transition-colors underline-offset-2 hover:underline"
          >
            UpNet Solutions
          </a>
        </div>
        <div className="text-text-muted">
          <span className="text-accent">◆</span> powered by GitHub REST API
        </div>
      </div>
    </footer>
  )
}
