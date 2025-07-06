"use server";

import db from "@/db/db";
import { parseServerActionResponse } from "@/lib/utils";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { id } from "zod/v4/locales";

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
    const flatErrors = Object.fromEntries(
      Object.entries(result.error.formErrors.fieldErrors).map(
        ([key, value]) => [key, value?.[0] ?? "Invalid"]
      )
    );
    return { status: "ERROR", errors: flatErrors };
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
    const addedData = await db.product.create({
      data: {
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        filePath,
        imagePath,
        isAvailableForPurchase: false, // Consider adding this field
      },
    });

    return parseServerActionResponse({
      ...addedData,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    // Clean up uploaded files if something went wrong
    await fs.unlink(filePath).catch(() => {});
    await fs.unlink(`public${imagePath}`).catch(() => {});

    // Return error message
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

export const toggleProductAvailability = async (
  id: string,
  isAvailableForPurchase: boolean
) => {
  try {
    const result = await db.product.update({
      where: { id },
      data: { isAvailableForPurchase },
    });
    if (!result) {
      return parseServerActionResponse({
        error: "Product not found",
        status: "ERROR",
      });
    }
    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error toggling product availability:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const result = await db.product.delete({ where: { id } });
    if (!result) {
      return parseServerActionResponse({
        error: "Product not found",
        status: "ERROR",
      });
    }
    await fs.unlink(result.filePath);
    await fs.unlink(`public${result.imagePath}`);
    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error toggling product availability:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

export const updateProduct = async (id: string, formData: FormData) => {
  const editSchema = addSchema.extend({
    file : fileSchema.optional(),
    image: imageSchema.optional(),
  })
  const result = editSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    const flatErrors = Object.fromEntries(
      Object.entries(result.error.formErrors.fieldErrors).map(
        ([key, value]) => [key, value?.[0] ?? "Invalid"]
      )
    );
    return { status: "ERROR", errors: flatErrors };
  }

  const data = result.data;
  const product = await db.product.findUnique({ where: { id } });
  if(product === null) {
    return notFound();
  }

  //if the file or image is not provided, keep the existing paths
  let filePath = product.filePath;
  if(data.file != null && data.file.size > 0){
      await fs.unlink(product.filePath).catch(() => {});
      filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
      await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
  }

  let imagePath = product.imagePath;
  if(data.image != null && data.image.size > 0){
      await fs.unlink(`public${product.imagePath}`).catch(() => {});
      imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
      await fs.writeFile(
        `public${imagePath}`,
        Buffer.from(await data.image.arrayBuffer())
      );
  }

  try {

    // Save to database (now awaited)
    const updatedData = await db.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        filePath,
        imagePath,
        isAvailableForPurchase: false, // Consider adding this field
      },
    });

    return parseServerActionResponse({
      ...updatedData,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    // Clean up uploaded files if something went wrong
    await fs.unlink(filePath).catch(() => {});
    await fs.unlink(`public${imagePath}`).catch(() => {});

    // Return error message
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};
