import { NextRequest } from "next/server";
import prisma from "../../../../../prisma";
import { createHandler } from "@premieroctet/next-admin/appHandler";
import options from "../../../../../nextAdminOptions";

const { run } = createHandler({
  apiBasePath: "/api/admin",
  prisma,
  options,
});

export const GET = async (
  req: NextRequest,
  context: { params: { nextadmin: string[] } },
) => {
  try {
    return await run(req, { params: Promise.resolve(context.params) });
  } catch (error) {
    console.error("Admin API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  context: { params: { nextadmin: string[] } },
) => {
  try {
    return await run(req, { params: Promise.resolve(context.params) });
  } catch (error) {
    console.error("Admin API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  context: { params: { nextadmin: string[] } },
) => {
  try {
    return await run(req, { params: Promise.resolve(context.params) });
  } catch (error) {
    console.error("Admin API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
