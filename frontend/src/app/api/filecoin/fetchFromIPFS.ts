import { createClient } from '@/lib/web3Storage';

export async function POST(request: Request) {
  const storageClient = await createClient();
  const { cid } = request;

  if (cid === undefined) {
    return Response.json({ message: "No cid" }, { status: 400 })
  }

  const res = await storageClient.capability.upload.get(cid)
  console.log(res);
  return res
}