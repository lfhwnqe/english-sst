import { Resource } from "sst";
import Form from "@/app/components/common/form";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
export const dynamic = "force-dynamic";

export default async function Home() {
  const command = new PutObjectCommand({
    Key: crypto.randomUUID(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Bucket: (Resource as any).MyBucket.name,
  });
  const url = await getSignedUrl(new S3Client({}), command);

  return (
    <div className="bg-slate-500">
      <main className="w-full">
        <Form url={url} />
      </main>
    </div>
  );
}
