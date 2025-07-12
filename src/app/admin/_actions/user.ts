import db from "@/db/db";
import { parseServerActionResponse } from "@/lib/utils";
import { notFound } from "next/navigation";

export const deleteUser = async (id: string) => {
  try {
    const result = await db.user.delete({
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