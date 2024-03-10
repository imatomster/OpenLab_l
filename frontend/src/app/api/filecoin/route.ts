import * as Client from '@web3-storage/w3up-client'
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory'
import { importDAG } from '@ucanto/core/delegation'
import { CarReader } from '@ipld/car'
import * as Signer from '@ucanto/principal/ed25519'

export async function POST(request: Request) {
  const storageClient = await main();
  const { formData } = request;

  if (formData === undefined) {
    return Response.json({ message: "No files" }, { status: 400 })
  }
  const result = await formData();


  let allFiles = [];
  for (let [key, value] of result.entries()) {
    // console.log(`${key}: ${value}`);
    // If 'value' is a File object, you can log some of its properties
    if (value instanceof File) {
      console.log(`File name: ${value.name}, File type: ${value.type}, File size: ${value.size} bytes`);
      allFiles.push(new File([value], '' + value.name));
    }
  }

  console.log(allFiles);

  const directoryCid = await storageClient.uploadDirectory(allFiles)
  console.log(directoryCid)

  return Response.json({ files: allFiles, uri: directoryCid }, { status: 200 })

  // const { filePaths } = request

  // const principal = 
  // const client = await Client.create({ principal, store: new StoreMemory() })

  // return Response.json({ product })
}

async function main() {
  // Load client with specific private key
  const principal = Signer.parse(process.env.MKEY || "")
  const store = new StoreMemory()
  const client = await Client.create({ principal, store })
  // Add proof that this agent has been delegated capabilities on the space
  const proof = await parseProof(process.env.PROOF || "")
  const space = await client.addSpace(proof)
  console.log(space)
  await client.setCurrentSpace(space.did())
  return client;
}

/** @param {string} data Base64 encoded CAR file */
async function parseProof(data: string) {
  const blocks = []
  const reader = await CarReader.fromBytes(Buffer.from(data, 'base64'))
  for await (const block of reader.blocks()) {
    blocks.push(block)
  }
  return importDAG(blocks)
}

function makeFileObjects(obj: any) {
  // You can create File objects from a Blob of binary data
  // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
  // Here we're just storing a JSON object, but you can store images,
  // audio, or whatever you want!
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })

  const files = [
    new File(['contents-of-file-1'], 'plain-utf8.txt'),
    new File([blob], 'hello.json')
  ]
  return files
}