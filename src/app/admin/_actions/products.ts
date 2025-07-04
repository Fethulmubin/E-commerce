"use server";

import db from "@/db/db";
import fs from "fs/promises";
import { redirect } from "next/navigation";
import { z } from "zod";

const fileSchema = z.instanceof(File).refine((file) => file.size > 0, {
  message: "File is required",
});
const imageSchema = z
  .instanceof(File)
  .refine((file) => file.size === 0 || file.type.startsWith("image/"), {
    message: "Image is required and must be an image file",
  });
const addSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  priceInCents: z.coerce.number().int().min(1, "Price must be greater than 0"),
  file: fileSchema,
  image: imageSchema,
});

export const addProduct = async (formData: FormData) => {
  const result = addSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;

  try {
    // Ensure directories exist
    await fs.mkdir("products", { recursive: true });
    await fs.mkdir("public/products", { recursive: true });

    // Handle file upload

    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

    // Handle image upload (fixed to use data.image)

    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );

    // Save to database (now awaited)
    await db.product.create({
      data: {
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        filePath,
        imagePath,
        isAvailableForPurchase: false, // Consider adding this field
      },
    });

    
    redirect("/admin/products");
  } catch (error) {
    // Clean up uploaded files if something went wrong
    await fs.unlink(filePath).catch(() => {});
    await fs.unlink(`public${imagePath}`).catch(() => {});

    // Return error message
    return { _form: ["Something went wrong. Please try again."] };
  }
};
