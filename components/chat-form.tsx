import { ChatRequestOptions } from "ai"
import { SendHorizonal } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface ChatFormProps {
	input: string
	handleInputChange: (
		event:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => void
	onSubmit: (
		e: React.FormEvent<HTMLFormElement>,
		chatRequestOptions?: ChatRequestOptions | undefined
	) => void
	isLoading: boolean
}

const ChatForm = ({
	input,
	handleInputChange,
	onSubmit,
	isLoading,
}: ChatFormProps) => {
	return (
		<form
			onSubmit={onSubmit}
			className="border-t border-primary/10 py-4 flex items-center"
		>
			<Input
				disabled={isLoading}
				value={input}
				onChange={handleInputChange}
				placeholder="Type a message"
				className="rounded-lg bg-primary/10"
			/>
			<Button disabled={isLoading} variant="ghost">
				<SendHorizonal className="h-6 w-6" />
			</Button>
		</form>
	)
}

export default ChatForm
