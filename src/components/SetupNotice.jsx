import "./SetupNotice.css";

export default function SetupNotice() {
  return (
    <div className="setup-notice">
      <div className="setup-card">
        <span className="setup-eyebrow">One-time setup</span>
        <h1>Connect your Supabase database</h1>
        <p>
          This portal stores data in the cloud so it's the same on every device. Before it
          can run, it needs to know which Supabase project to talk to.
        </p>

        <ol>
          <li>
            Create a free project at{" "}
            <a href="https://supabase.com" target="_blank" rel="noreferrer">
              supabase.com
            </a>
            .
          </li>
          <li>
            In your new project, open <strong>SQL Editor</strong>, paste the contents of{" "}
            <code>supabase_schema.sql</code> (included in this project folder), and run it.
            This creates the students and subjects tables.
          </li>
          <li>
            In <strong>Project Settings → API</strong>, copy the <strong>Project URL</strong>{" "}
            and <strong>anon public</strong> key.
          </li>
          <li>
            In this project's root folder, create a file named <code>.env</code> (copy{" "}
            <code>.env.example</code> and rename it) and fill in:
            <pre>{`VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key`}</pre>
          </li>
          <li>Restart the dev server (or redeploy, if hosted) and refresh this page.</li>
        </ol>

        <p className="setup-footnote">Full details are in README.md.</p>
      </div>
    </div>
  );
}
