import { withApiHandler } from "@/utils/withApiHandler";
import { success, error } from "@/utils/apiResponse";
import { NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/config/constants";
import { v4 as uuidv4 } from "uuid";

export const POST = withApiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const { title, content } = body;
  if (!title || !content) {
    return Response.json(error("Title and content are required"), {
      status: 400,
    });
  }
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection("posts");
  const result = await collection.insertOne({
    title,
    content,
    createdAt: new Date(),
    id: uuidv4(),
  });
  return Response.json(success({ id: result.insertedId }), { status: 201 });
});
