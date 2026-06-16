import {prisma} from "@/lib/prisma";

export async function GET(req, { params }) {
    const { id } = await params;
    const conversation = await prisma.conversation.findUnique({
        where: {
            id,
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });
    return Response.json(conversation);
}