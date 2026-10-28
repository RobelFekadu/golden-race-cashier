const DEFAULT_PAGE_TITLE = "Ticket";

function normalizeList(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

function getBaseHref() {
  const port = window.location.port ? `:${window.location.port}` : "";
  return `${window.location.protocol}//${window.location.hostname}${port}${window.location.pathname}`;
}

function getStylesheetUrl() {
  try {
    return new URL("assets/cashier/ticket.css", document.baseURI).href;
  } catch {
    return "/assets/cashier/ticket.css";
  }
}

export function buildMarkup(body, options = {}) {
  const pageTitle = options.pageTitle || DEFAULT_PAGE_TITLE;
  const stylesheets = normalizeList(options.stylesheets || getStylesheetUrl());
  const styles = normalizeList(options.styles);
  const template = options.templateString;
  let content = body || "";

  if (template && /{{\s*printBody\s*}}/i.test(template)) {
    content = template.replace(/{{\s*printBody\s*}}/gi, content);
  }

  const head = [
    '<meta http-equiv="X-UA-Compatible" content="IE=edge" />',
    '<meta charset="UTF-8" />',
    `<title>${pageTitle}</title>`,
    ...stylesheets.map((href) => `<link rel="stylesheet" href="${href}" />`),
    ...styles.map((css) => `<style type="text/css">${css}</style>`),
    `<base href="${getBaseHref()}" />`,
  ];

  return [
    "<html><head>",
    ...head,
    '</head><body class="pe-body cashier-ticket">',
    content,
    "</body></html>",
  ].join("");
}

export function printHtml(body, options = {}) {
  if (typeof document === "undefined") {
    return Promise.reject(new Error("Browser printing is not available"));
  }

  return new Promise((resolve, reject) => {
    const frameId = `printElement_${Math.round(99999 * Math.random())}`;
    const frame = document.createElement("iframe");
    frame.setAttribute("id", frameId);
    frame.setAttribute("src", "about:blank");
    frame.setAttribute("frameBorder", "0");
    frame.setAttribute("scrolling", "no");
    frame.setAttribute("aria-hidden", "true");
    frame.style.cssText =
      "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";

    let settled = false;
    let triggered = false;
    let fallbackTimer = null;

    const cleanup = () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      try {
        frame.remove();
      } catch {
        /* ignore */
      }
    };

    const finish = (printed, error) => {
      if (settled) return;
      settled = true;
      setTimeout(cleanup, 2000);
      if (error) reject(error);
      else resolve(printed);
    };

    const triggerPrint = () => {
      if (triggered) return;
      triggered = true;

      const run = () => {
        try {
          const win = frame.contentWindow;
          const doc = win.document;
          doc.title = options.pageTitle || DEFAULT_PAGE_TITLE;
          win.focus();
          win.print();
          win.addEventListener("afterprint", () => finish(true), {
            once: true,
          });
          setTimeout(() => finish(true), 1500);
        } catch (error) {
          finish(false, error);
        }
      };

      try {
        const fonts = frame.contentWindow.document.fonts;
        if (fonts && fonts.ready && typeof fonts.ready.then === "function") {
          Promise.race([
            fonts.ready.catch(() => null),
            new Promise((done) => setTimeout(done, 750)),
          ]).then(run);
        } else {
          run();
        }
      } catch {
        run();
      }
    };

    try {
      document.body.appendChild(frame);
      const win = frame.contentWindow;
      const doc = win.document;

      win.addEventListener("load", triggerPrint, { once: true });
      fallbackTimer = setTimeout(triggerPrint, 1500);

      doc.open();
      doc.write(buildMarkup(body, options));
      doc.close();
    } catch (error) {
      finish(false, error);
    }
  });
}

export function printElement(element, options = {}) {
  if (!element) return Promise.resolve(false);
  return printHtml(element.outerHTML, options);
}

export default {
  buildMarkup,
  printHtml,
  printElement,
};
