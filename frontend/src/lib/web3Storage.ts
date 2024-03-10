import * as Client from '@web3-storage/w3up-client'
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory'
import { importDAG } from '@ucanto/core/delegation'
import { CarReader } from '@ipld/car'
import * as Signer from '@ucanto/principal/ed25519'

export async function createClient() {
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

export async function listIPFS(cid: string) {
  const gatewayUrl = `https://ipfs.io/ipfs/${cid}`;

  let content = "";

  try {
    const response = await fetch(gatewayUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    content = await response.text();
  } catch (error) {
    console.error("Failed to fetch IPFS content:", error);
    return
  }

  const regexPattern = `<a href="\\/ipfs\\/${cid}\\/([^"]+)">([^<]+)<\\/a>`;
  const regex = new RegExp(regexPattern, 'g');

  let match;
  const files = [];

  while ((match = regex.exec(content)) !== null) {
    // match[1] is the file path and name relative to the CID directory
    // match[2] is the text content of the <a> tag, which should be the file name
    files.push({
      path: match[1],
      name: match[2]
    });
  }

  // console.log(files);

  // console.log("storage");
  // console.log(content);
  return files;
}

export async function getImageByIndex(cid: string, index: string) {
  const listofIPFS = await listIPFS(cid);
  const imageDict = listofIPFS[parseInt(index)];

  const gatewayUrl = `https://${cid}.ipfs.w3s.link/${imageDict["path"]}`;

  const res = { name: imageDict["name"], img: gatewayUrl };
  return res;
}