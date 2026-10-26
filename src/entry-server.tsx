import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { PassThrough } from "node:stream";
import App from "./App";
export { getRoutes, getMetadata } from "./lib/seo";
export { projects } from "./data/projects";
export { articles } from "./lib/blog";
export { personal } from "./data/personal";
export function render(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = "";
    const stream = new PassThrough();
    stream.on("data", (chunk) => (html += chunk.toString()));
    stream.on("end", () => resolve(html));
    stream.on("error", reject);
    const output = renderToPipeableStream(
      <StaticRouter location={path}>
        <App />
      </StaticRouter>,
      {
        onAllReady() {
          output.pipe(stream);
        },
        onError: reject,
      },
    );
  });
}
