import { serve } from "inngest/next";

import { inngest } from "@/lib/inngest/client";
import {
  checkBudgetAlerts,
  generateMonthlyReports,
  processRecurringTransaction,
  triggerRecurringTransactions,
} from "@/lib/inngest/function";
import aj from "@/lib/arcjet";

const handlers = serve({
  client: inngest,
  functions: [
    processRecurringTransaction,
    triggerRecurringTransactions,
    generateMonthlyReports,
    checkBudgetAlerts,
  ],
});

async function withArcjet(req, ctx, next) {
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    return new Response("Forbidden", { status: decision.status ?? 403 });
  }

  return next(req, ctx);
}

export async function GET(req, ctx) {
  return withArcjet(req, ctx, handlers.GET);
}

export async function POST(req, ctx) {
  return withArcjet(req, ctx, handlers.POST);
}

export async function PUT(req, ctx) {
  return withArcjet(req, ctx, handlers.PUT);
}
