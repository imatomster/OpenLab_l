import { createClient } from '@/lib/web3Storage';

export async function POST(request: Request) {
  const storageClient = await createClient();
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
