import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const graduates = [
    {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "123-456-7890",
      address: "123 Main St, Anytown, USA",
      graduationDate: "2023-05-01",
    },
]
  return NextResponse.json(graduates);
}