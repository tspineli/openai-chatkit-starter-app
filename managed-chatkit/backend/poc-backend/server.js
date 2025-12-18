import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => res.status(200).send("ok"));

app.post("/api/create-session", async (req, res) => {
  // ChatKit frontend manda: { workflow: { id: "wf_..." } }
  const workflowId = req?.body?.workflow?.id || process.env.CHATKIT_WORKFLOW_ID;
  if (!workflowId) {
    return res.status(400).json({ error: "Missing workflow.id or CHATKIT_WORKFLOW_ID" });
  }

  // ⚠️ Aqui você cria a sessão com o provider do ChatKit/Agents que você estiver usando.
  // Como você não colou sua implementação atual (e muda dependendo do sample),
  // vou deixar o “stub” com erro explícito pra você plugar o trecho correto:
  return res.status(501).json({
    error: "NOT_IMPLEMENTED",
    message:
      "Plugue aqui a chamada de criação de sessão (client secret) do ChatKit/Agents e retorne o secret para o frontend."
  });
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log(`Backend listening on :${port}`));
