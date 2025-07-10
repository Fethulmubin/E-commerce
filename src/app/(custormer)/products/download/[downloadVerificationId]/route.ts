import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ downloadVerificationId: string }> }
) {
  const { downloadVerificationId } = await params;

  const data = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
    select: { products: { select: { filePath: true, name: true } } },
  });

  if (!data) {
    return NextResponse.redirect(
      new URL("/products/download/expired",
      req.url
    ))
  }

  const { size } = await fs.stat(data.products.filePath);
  const file = await fs.readFile(data.products.filePath);
  const extension = data.products.filePath.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${data.products.name}.${extension}"`,
      "Content-Length": size.toString(),
    },
  });
}
