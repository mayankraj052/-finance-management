import { seedTransactions } from "@/actions/seed";
import aj from "@/lib/arcjet";

export async function GET(req) {
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    return Response.json(
      { error: "Forbidden", reason: decision.reason?.message },
      { status: decision.status ?? 403 }
    );
  }

  const result = await seedTransactions();
  return Response.json(result);
}
