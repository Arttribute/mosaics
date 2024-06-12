import { API } from "@huddle01/server-sdk/api";
import { v4 as uuidv4 } from "uuid";

export const revalidate = 0;

const getRoomId = async () => {
  const api = new API({
    apiKey: process.env.HUDDLE_API_KEY!,
  });

  const rooomTitle = `room-${uuidv4()}`;

  const createNewRoom = await api.createRoom({
    title: rooomTitle,
  });

  const roomId = createNewRoom?.data;

  return roomId;
};

export async function GET(request: Request) {
  const roomId = await getRoomId();

  return Response.json({ status: 200, roomId });
}
