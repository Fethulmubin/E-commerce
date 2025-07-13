"use server";
import db from "@/db/db";
import { parseServerActionResponse } from "@/lib/utils";
import { notFound } from "next/navigation";

export const deleteOrder = async (id: string) => {
  try {
    const result = await db.order.delete({
      where: { id },
    });
    if (result === null) {
      return notFound();
    }
    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};