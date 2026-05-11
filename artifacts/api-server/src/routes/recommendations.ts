import { Router, type IRouter } from "express";
import { db, booksTable } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";
import { GetRecommendationsResponse } from "@workspace/api-zod";

const router: IRouter = Router();
const recommendationsModel =
  process.env.AI_RECOMMENDATIONS_MODEL ?? "gemini-1.5-flash";
const fallbackModels = ["gemini-1.5-flash"];

router.get("/recommendations", async (req, res): Promise<void> => {
  const allBooks = await db.select().from(booksTable);

  const ratedBooks = allBooks.filter((b) => b.rating != null);
  const topBooks = ratedBooks
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 10);

  const bookListText = topBooks
    .map((b) => `- "${b.title}" by ${b.author} (nota: ${b.rating ?? "sem nota"})`)
    .join("\n");

  const allAuthors = [...new Set(allBooks.map((b) => b.author))].join(", ");
  const allGenres = [...new Set(allBooks.filter((b) => b.genre).map((b) => b.genre))].join(", ");

  const prompt = `Você é um especialista em literatura e consultor de clubes do livro. 
  
O clube do livro "Clube do Livro Caxias" leu os seguintes livros com maiores notas:
${bookListText}

Autores que já leram: ${allAuthors}

Com base nesses gostos literários, sugira exatamente 6 livros que este clube ainda NÃO leu e que certamente vão adorar. Evite repetir autores já lidos.

Responda APENAS com um JSON válido no seguinte formato (sem markdown, sem explicação extra):
[
  {
    "title": "Nome do Livro",
    "author": "Nome do Autor", 
    "reason": "Explicação curta em português (1-2 frases) de por que este clube vai adorar",
    "similarTo": "Nome do livro já lido pelo clube que é mais similar"
  }
]`;

  const modelsToTry = [recommendationsModel, ...fallbackModels].filter(
    (model, idx, arr) => arr.indexOf(model) === idx,
  );

  let content = "[]";
  let lastError: unknown;

  for (const model of modelsToTry) {
    try {
      const response = await openai.chat.completions.create({
        model,
        //max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      });
      content = response.choices[0]?.message?.content ?? "[]";
      req.log.error(
        {
          err: response.choices[0]?.message,
        },
        "AI recommendation request failed for model",
      );
      break;
    } catch (error) {
      lastError = error;

      req.log.error(
        {
          err: error,
          model,
          baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
        },
        "AI recommendation request failed for model",
      );
    }
  }

  if (content === "[]" && lastError) {
    res.status(502).json({
      error: "AI provider request failed " + lastError,
      modelTried: modelsToTry,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    });
    return;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content.trim());
  } catch {
    req.log.error({ content }, "Failed to parse AI recommendations response");
    res.status(500).json({ error: "Failed to generate recommendations" });
    return;
  }

  const result = GetRecommendationsResponse.safeParse(parsed);
  if (!result.success) {
    req.log.error({ error: result.error.message }, "Recommendations schema validation failed");
    res.status(500).json({ error: "Invalid recommendations format" });
    return;
  }

  res.json(result.data);
});

export default router;
