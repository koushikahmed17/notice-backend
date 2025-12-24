// api/index.ts

export default async function handler(req: any, res: any) {
  await initOnce();
  return (app as any)(req, res);
}
