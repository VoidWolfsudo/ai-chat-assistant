import { generateResponse } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { MessageRole } from "@prisma/client";

export async function POST(req) {
    const { message, conversationId } = await req.json();
    let conversation;
    if (conversationId) {
        conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
        });
    } else {
        conversation = await prisma.conversation.create({
            data: {
                title: message.slice(0, 50),
            },
        });
    }
    await prisma.message.create({
        data: {
            role: MessageRole.USER,
            content: message,
            conversationId: conversation.id,
        },
    });

    const reply = await generateResponse(message, conversation.id);

    await prisma.message.create({
        data: {
            role: MessageRole.ASSISTANT,
            content: reply,
            conversationId: conversation.id,
        },
    });

    return Response.json({
        reply,
        conversationId: conversation.id,
    }); 
}