import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { ArrowRight, TerminalSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/context";
import { personal } from "../data/personal";
import { social } from "../data/social";
import { skills } from "../data/skills";
import { projects } from "../data/projects";
import { parseCommand, type Command } from "../lib/terminal";
import { ExternalLink } from "./ui";
type Row = { input: string; command: Command | "unknown" };
export default function Terminal() {
  const { t, lang, local } = useI18n();
  const [input, setInput] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(0);
  const output = useRef<HTMLDivElement>(null);
  const [savedInput, setSavedInput] = useState("");
  useEffect(() => {
    if (rows.length && output.current)
      output.current.scrollTop = output.current.scrollHeight;
  }, [rows]);
  function run(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const command = parseCommand(input);
    setHistory((h) => [...h, input]);
    setCursor(history.length + 1);
    setRows((r) =>
      command === "clear" ? [] : [...r.slice(-99), { input, command }],
    );
    setInput("");
    setSavedInput("");
  }
  function keyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cursor === history.length) setSavedInput(input);
      const next = Math.max(0, cursor - 1);
      setCursor(next);
      setInput(history[next] || input);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(history.length, cursor + 1);
      setCursor(next);
      setInput(history[next] ?? savedInput);
    }
  }
  function response(command: Row["command"]) {
    switch (command) {
      case "help":
        return t.terminal.help;
      case "about":
        return `${personal.name[lang]} — ${personal.role[lang]}. ${personal.story[lang]}`;
      case "skills":
        return skills.map((s) => (
          <div key={s.title.en}>
            <strong>{s.title[lang]}: </strong>
            {s.items.join(", ")}
          </div>
        ));
      case "projects":
        return (
          <div className="terminal-projects">
            {projects.map((p) => (
              <Link key={p.id} to={local(`/projects/${p.slug}`)}>
                {p.title} ↗
              </Link>
            ))}
          </div>
        );
      case "github":
        return (
          <ExternalLink href={social.github}>{t.terminal.github}</ExternalLink>
        );
      case "contact":
        return (
          <a href={`mailto:${personal.email}`}>
            {t.terminal.contact}: {personal.email}
          </a>
        );
      default:
        return t.terminal.unknown;
    }
  }
  return (
    <div className="terminal">
      <div className="terminal-top">
        <div className="window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <span dir="ltr">{t.terminal.titleBar}</span>
        <TerminalSquare size={15} aria-hidden="true" />
      </div>
      <div
        className="terminal-output"
        ref={output}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        <div className="terminal-welcome">
          <span>✦</span> {t.terminal.welcome}
          <p>{t.terminal.hint}</p>
        </div>
        {rows.map((row, i) => (
          <div key={i} className="terminal-row">
            <p dir="ltr">
              <span>❯</span> {row.input}
            </p>
            <div dir={lang === "ar" ? "rtl" : "ltr"}>
              {response(row.command)}
            </div>
          </div>
        ))}
      </div>
      <form className="terminal-input" onSubmit={run} dir="ltr">
        <span aria-hidden="true">❯</span>
        <input
          aria-label={t.terminal.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={keyDown}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={200}
          placeholder="help"
        />
        <button type="submit" aria-label={t.terminal.submit}>
          <ArrowRight size={19} />
        </button>
      </form>
    </div>
  );
}
