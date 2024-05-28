const API_KEY = process.env.ASTRIA_API_KEY;

export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prompt_id = searchParams.get("prompt_id");
  const model_id = searchParams.get("model_id");

  const res = await fetch(
    `https://api.astria.ai/tunes/${model_id}/prompts/${prompt_id}`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    }
  );
  const data = await res.json();

  return Response.json({ data });
}
