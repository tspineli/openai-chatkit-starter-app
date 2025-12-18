const readEnvString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

/**
 * Workflow ID (Agent Builder)
 * Deve ser definido no frontend:
 * VITE_CHATKIT_WORKFLOW_ID=wf_xxx
 */
export const workflowId = (() => {
  const id = readEnvString(import.meta.env.VITE_CHATKIT_WORKFLOW_ID);
  if (!id || id.startsWith("wf_replace")) {
    throw new Error("Set VITE_CHATKIT_WORKFLOW_ID in your environment variables.");
  }
  return id;
})();

/**
 * Base URL do backend ChatKit
 * - Em dev: undefined → usa proxy do Vite (/api/...)
 * - Em prod: https://<backend>.up.railway.app
 */
const apiBase = readEnvString(import.meta.env.VITE_CHATKIT_API_BASE)?.replace(/\/$/, "");

/**
 * Cria o fetcher responsável por obter o client_secret
 */
export function createClientSecretFetcher(
  workflow: string,
  endpoint = `${apiBase ?? ""}/api/create-session`
) {
  return async (currentSecret: string | null) => {
    if (currentSecret) return currentSecret;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflow: { id: workflow } }),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      client_secret?: string;
      error?: string;
    };

    if (!response.ok) {
      throw new Error(payload.error ?? "Failed to create session");
    }

    if (!payload.client_secret) {
      throw new Error("Missing client secret in response");
    }

    return payload.client_secret;
  };
}
