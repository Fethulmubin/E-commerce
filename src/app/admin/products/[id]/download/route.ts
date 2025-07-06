import db from "@/db/db";
import fs from "fs/promises";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest,{params} : {params : {id :string}}) => {
    const { id } = params;
    try {
        const product = await db.product.findUnique({
            where: { id },
            select: {
                name: true,
                filePath: true
    }
})
    if (product == null ) return notFound()

    const {size} = await fs.stat(product.filePath);
    const file  = await fs.readFile(product.filePath)
    const extension = product.filePath.split('.').pop()

    return new NextResponse(file, {
        headers: {
            "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
            "Content-Length": size.toString(),
        }
    },);
    } catch (error) {
        console.error("Error downloading product file:", error);
        return new NextResponse("Error downloading product file", { status: 500 });
        
    }

}