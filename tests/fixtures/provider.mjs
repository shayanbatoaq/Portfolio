// Loaded only by the test server, never by the deployed application.
// Fail closed on external network calls so tests cannot use real services.
const nativeFetch = globalThis.fetch;
globalThis.fetch = async (input, options) => {
  const url = typeof input === "string" ? input : input.url ?? input.toString();
  if (url === "https://openrouter.ai/api/v1/chat/completions") {
    const body = JSON.parse(options.body);
    const latest = body.messages.at(-1).content;
    if (latest === "test:provider-rate-limit") return new Response("", { status: 429 });
    if (latest === "test:provider-failure") return new Response("", { status: 502 });
    if (latest === "test:invalid-response") return Response.json({ choices: [] });
    return Response.json({
      model: "test/local-provider",
      choices: [{ message: { content: "Local provider response: LapSignal is an alpha telemetry and coaching prototype." } }],
      usage: { prompt_tokens: 20, completion_tokens: 15, total_tokens: 35 },
    });
  }
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/)/.test(url)) return nativeFetch(input, options);
  throw new Error("External network access is disabled in portfolio tests");
};
