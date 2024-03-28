"use client"

import { Companion } from "@prisma/client"
import { ElementRef, useEffect, useRef, useState } from "react"
import ChatMessage, { ChatMessageProps } from "./chat-message"

interface ChatMessagesProps {
	messages: ChatMessageProps[]
	isLoading: boolean
	companion: Companion
}

const ChatMessages = ({
	messages,
	isLoading,
	companion,
}: ChatMessagesProps) => {
	const [fakeLoading, setFakeLoading] = useState(
		messages.length === 0 ? true : false
	)

	// scroll to the bottom of the messages
	const scrollRef = useRef<ElementRef<"div">>(null)

	// show spinner if there are no messages for 1 second (improves UX)
	useEffect(() => {
		const timeout = setTimeout(() => {
			setFakeLoading(false)
		}, 1000)

		return () => {
			clearTimeout(timeout)
		}
	}, [])

	// run if new message added
	useEffect(() => {
		scrollRef?.current?.scrollIntoView({ behavior: "smooth" })
	}, [messages.length])

	return (
		<div className="flex-1 overflow-y-auto pr-4">
			<ChatMessage
				isLoading={fakeLoading}
				src={companion.src}
				role="system"
				content={`Hello, I am ${companion.name}, ${companion.description}`}
			/>
			{messages.map(message => (
				<ChatMessage
					key={message.content}
					isLoading={isLoading}
					src={companion.src}
					role={message.role}
					content={message.content}
				/>
			))}
			{/* show spinner when loading message from server (AI) */}
			{isLoading && (
				<ChatMessage isLoading={isLoading} src={companion.src} role="system" />
			)}

			<div ref={scrollRef} />
		</div>
	)
}

export default ChatMessages
