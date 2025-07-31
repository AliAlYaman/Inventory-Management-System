import express from "express"
import cors from "cors"
import "dotenv/config"
import { streamText, generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const app = express()
const port = 3001

app.use(express.json())
// Allow all origins for debugging purposes
app.use(cors())

app.post("/api/ai", async (req, res) => {
  const { messages, inventory, task, itemInfo } = req.body
  const model = openai("gpt-4o-mini")

  try {
    switch (task) {
      case "chat": {
        if (!messages || !inventory) {
          return res.status(400).send("Missing messages or inventory data for chat task")
        }
        const systemPrompt = `You are an expert inventory management assistant...` // (Same as before)

        const result = await streamText({
          model: model,
          system: systemPrompt,
          messages: messages,
        })

        // --- THE ONLY CHANGE IS HERE ---
        // Use the official AI SDK helper to pipe the stream to the response.
        // This is more robust than the manual loop.
        return result.pipeToResponse(res)
      }

      case "audit-inventory": {
        if (!inventory) {
          return res.status(400).send("Missing inventory data for audit task")
        }
        const systemPrompt = `You are an expert inventory analyst...` // (Same as before)
        const userPrompt = `Please audit the following inventory: ${JSON.stringify(inventory, null, 2)}`

        const { text } = await generateText({ model, system: systemPrompt, prompt: userPrompt })
        res.send(text)
        break
      }

      case "forecast-restock": {
        if (!itemInfo) {
          return res.status(400).send("Missing itemInfo for forecast task")
        }
        const systemPrompt = `You are a supply chain analyst. Based on the item's current quantity and its sales history, predict when it will run out of stock.
        Provide a concise, human-readable forecast (e.g., "in ~3 weeks", "in ~2 months", "by late August").
        If sales history is unavailable or insufficient, state that you cannot make a prediction.
        Respond with only the prediction and nothing else.`
        const userPrompt = `Forecast restock for item: ${JSON.stringify(itemInfo, null, 2)}`

        const { text } = await generateText({ model, system: systemPrompt, prompt: userPrompt })
        res.send(text)
        break
      }

      case "generate-description": {
        if (!itemInfo) {
          return res.status(400).send("Missing itemInfo for generate-description task")
        }
        const systemPrompt = `You are a professional copywriter...` // (Same as before)
        const userPrompt = `Generate a description for the item: Name: "${itemInfo.name}", Category: "${itemInfo.category}".`
        const { text } = await generateText({ model, system: systemPrompt, prompt: userPrompt })
        res.send(text)
        break
      }

      case "suggest-category": {
        if (!itemInfo) {
          return res.status(400).send("Missing itemInfo for suggest-category task")
        }
        const systemPrompt = `You are an inventory categorization expert...` // (Same as before)
        const userPrompt = `Suggest a category for the item: "${itemInfo.name}".`
        const { text } = await generateText({ model, system: systemPrompt, prompt: userPrompt })
        res.send(text)
        break
      }

      default:
        res.status(400).send("Invalid task")
    }
  } catch (error) {
    console.error("Error processing AI request:", error)
    if (error.message.includes("API key")) {
      res.status(401).send("Invalid or missing OpenAI API key on the server.")
    } else {
      res.status(500).send("An error occurred on the server.")
    }
  }
})

app.listen(port, () => {
  console.log(`✅ Secure AI server listening on http://localhost:${port}`)
})
