import { auth, redirectToSignIn } from "@clerk/nextjs"

import prismadb from "@/lib/prismadb"
import { redirect } from "next/navigation"
import { ChatClient } from "./_components/client"

interface ChatIdPageProps {
	params: {
		chatId: string
	}
}

const ChatIdPage = async ({ params }: ChatIdPageProps) => {
	const { userId } = auth()

	if (!userId) {
		return redirectToSignIn()
	}

	const companion = await prismadb.companion.findUnique({
		where: {
			// id from db === id from url
			id: params.chatId,
		},
		// show messages that belong to this companion
		include: {
			messages: {
				orderBy: {
					// show messages in chronological order
					createdAt: "asc",
				},
				// show only messages that belong to this user
				where: {
					userId: userId,
				},
			},
			// show how many messages companion has
			_count: {
				select: {
					messages: true,
				},
			},
		},
	})

	// if no companion is found, redirect to home
	if (!companion) redirect("/")

	// if companion is found, return the chat client
	return <ChatClient companion={companion} />
}

export default ChatIdPage
