import { API } from "@huddle01/server-sdk/api";

const getRoomId = async () => {
  const api = new API({
    apiKey: process.env.HUDDLE_API_KEY!,
  });

  const createNewRoom = await api.createRoom({
    title: "Huddle01 Room 2",
  });

  const roomId = createNewRoom?.data;

  return roomId;
};

export async function GET(request: Request) {
  const roomId = await getRoomId();

  return Response.json({ status: 200, roomId });
}
