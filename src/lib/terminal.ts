export const commands = [
  "help",
  "about",
  "skills",
  "projects",
  "github",
  "contact",
  "clear",
] as const;
export type Command = (typeof commands)[number];
export function parseCommand(input: string): Command | "unknown" {
  const v = input.trim().toLowerCase();
  return commands.includes(v as Command) ? (v as Command) : "unknown";
}
