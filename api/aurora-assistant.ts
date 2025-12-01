import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleAuroraAssistant } from "../assistant/api/aurora-assistant";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return handleAuroraAssistant(req, res);
}
