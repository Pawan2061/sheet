import { prismaClient } from "@repo/prisma/client";
import { Response } from "express";
export const createSheet = async (req: any, res: Response): Promise<any> => {
  try {
    const slug = req.params.slug;
    const { title, content } = req.body;

    console.log("first steip");

    if (!slug || !title) {
      console.log("inside");

      return res.status(404).json({
        message: "not sufficient data",
      });
    }
    console.log("second steip");

    const sheet = await prismaClient.sheet.create({
      data: {
        slug: slug,
        title: title,
        content: content,
        userId: req.user.id,
        lastUpdateId: 3,
      },
    });
    console.log("first done");

    if (!sheet) {
      return res.status(400).json({
        message: "sheet is not created",
      });
    }
    return res.status(200).json(sheet);
  } catch (error) {
    console.log(error);

    return res.status(403).json({
      message: "Cant log in",
    });
  }
};

export const getSheetsBySlug = async (
  req: any,
  res: Response
): Promise<any> => {
  try {
    const slug = req.params.slug;

    if (!slug) {
      return res.status(404).json({
        message: "slug is not present",
      });
    }
    const sheet = await prismaClient.sheet.findUnique({
      where: {
        slug: slug,
      },
    });
    if (!sheet) {
      return res.status(404).json({
        message: "sheet not found",
      });
    }
    return res.status(200).json({
      sheet,
    });
  } catch (error) {
    console.log(error);

    return res.status(403).json({
      message: "sheets not  found",
    });
  }
};

export const getSheets = async (req: any, res: Response): Promise<any> => {
  try {
    const sheets = await prismaClient.sheet.findMany();
    if (!sheets) {
      return res.status(404).json({
        message: "sheets not found",
      });
    }
    return res.status(200).json({
      sheets,
    });
  } catch (error) {
    console.log(error);

    return res.status(403).json({
      message: "sheets not found",
    });
  }
};
