import { prismaClient } from "@repo/prisma/client";
import { Mysocket } from "../interface";
import { Response } from "express";

export async function findSheetAndUser(
  userId: string,
  sheetId: string
): Promise<any> {
  try {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });
    const space = await prismaClient.sheet.findUnique({
      where: {
        id: sheetId,
      },
    });
    if (!user || !space) {
      throw new Error("Either space or user is not found");
    }
    return { user, space };
  } catch (error) {
    throw new Error(`Error in findSheetAndUser: ${error}`);
  }
}
