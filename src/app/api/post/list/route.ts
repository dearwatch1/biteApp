import { withApiHandler } from "@/utils/withApiHandler";
import { success } from "@/utils/apiResponse";
import { NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/config/constants";

export const GET = withApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const skip = (Number(page) - 1) * Number(pageSize);

  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("posts");
  const total = await collection.countDocuments();
  const posts = await collection
    .find({})
    .skip(skip)
    .limit(Number(pageSize))
    .sort({ createdAt: -1 })
    .toArray();
  return Response.json(
    success({
      posts,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(total / pageSize),
    }),
    { status: 200 },
  );
});
