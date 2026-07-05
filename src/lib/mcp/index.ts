import { auth, defineMcp } from "@lovable.dev/mcp-js";
import echoTool from "./tools/echo";
import listWeakWordsTool from "./tools/list-weak-words";
import listBbSessionsTool from "./tools/list-bb-sessions";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "clipcraft-learn-mcp",
  title: "ClipCraft Learn",
  version: "0.1.0",
  instructions:
    "Tools for the ClipCraft Learn study app. Use `list_weak_words` to see the user's most-missed Black Book vocab, `list_bb_sessions` for recent practice sessions, and `echo` to verify connectivity.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [echoTool, listWeakWordsTool, listBbSessionsTool],
});
