"use client"

import * as z from "zod"

import { Category, Companion } from "@prisma/client"
import { useForm } from "react-hook-form"

import ImageUpload from "@/components/image-upload"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { Wand2 } from "lucide-react"

const PREAMBLE = ` You are an AI nutrition expert named Elena. You are a pioneering innovator in the field of nutrition science, with a profound interest in harnessing artificial intelligence to optimize human health. You are currently engaged in a conversation with a human who is deeply curious about your groundbreaking work and vision for the future of nutrition. You are driven by a passion for advancing human well-being through scientific discovery and technological innovation. Get ready to delve into the exciting world of AI-powered nutrition!`

const SEED_CHAT = `Human: Hi Elena, what's new in the world of AI-powered nutrition?
Elena: Ah, it's an exciting time! We're constantly exploring new frontiers in nutrition science with the help of AI. From personalized meal plans tailored to individual genetic profiles to predictive analytics for dietary-related diseases, the possibilities are endless.

Human: That sounds incredibly innovative! How do you see AI impacting the future of nutrition?
Elena: AI is revolutionizing every aspect of nutrition, from food production and distribution to dietary analysis and optimization. Imagine AI-powered kitchen appliances that can customize meals based on nutritional needs or virtual dieticians guiding users towards healthier eating habits in real-time.

Human: It's amazing to see how technology is shaping the future of food. Any specific projects or breakthroughs you're excited about?
Elena: Absolutely! One project I'm particularly excited about is leveraging AI to decode the complex interactions between diet, gut microbiota, and overall health. By understanding these relationships on a deeper level, we can unlock new strategies for preventing disease and enhancing well-being.`

interface CompanionFormProps {
	companion: Companion | null
	categories: Category[]
}

const formSchema = z.object({
	name: z.string().min(1, {
		message: "Name is required",
	}),
	description: z.string().min(1, {
		message: "Description is required",
	}),
	instructions: z.string().min(200, {
		message: "Instructions require at least 200 characters",
	}),
	seed: z.string().min(200, {
		message: "Seed require at least 200 characters",
	}),
	src: z.string().min(1, { message: "Image is required" }),
	categoryId: z.string().min(1, { message: "Category is required" }),
})

const CompanionForm = ({ companion, categories }: CompanionFormProps) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: companion || {
			name: "",
			description: "",
			instructions: "",
			seed: "",
			src: "",
			categoryId: undefined,
		},
	})

	const isLoading = form.formState.isSubmitting

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		console.log(data)
	}

	return (
		<div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 pb-10"
				>
					<div className="space-y-2 w-full">
						<div>
							<h3 className="text-lg font-medium">General Information</h3>
							<p className="text-sm text-muted-foreground">
								General Information about your companion
							</p>
						</div>
						<Separator className="bg-primary/10" />
					</div>

					<FormField
						name="src"
						render={({ field }) => (
							<FormItem className="flex flex-col items-center justify-center space-y-4 ">
								<FormControl>
									<ImageUpload
										disabled={isLoading}
										onChange={field.onChange}
										value={field.value}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* NAME */}
						<FormField
							name="name"
							control={form.control}
							render={({ field }) => (
								<FormItem className="col-span-2 md:col-span-1">
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder="Dr.Nutri"
											// onChange, onBlur...
											{...field}
										/>
									</FormControl>
									<FormDescription>
										This is how your AI Companion will be named.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* DESCRIPTION */}
						<FormField
							name="description"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder="Keto Nutri Chef"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Short description for your AI Companion
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* SELECT CATEGORY */}
						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<Select
										disabled={isLoading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger className="bg-background">
												<SelectValue
													defaultValue={field.value}
													placeholder="Select a category"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categories.map(category => (
												<SelectItem key={category.id} value={category.id}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormDescription>
										Select a category for your AI
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="space-y-2 w-full">
						<div>
							<h3 className="text-lg font-medium">Configuration</h3>
							<p className="text-sm text-muted-foreground">
								Detailed instructions for AI Behavior
							</p>
						</div>
						<Separator className="bg-primary/10" />
					</div>
					{/* INSTRUCTIONS */}
					<FormField
						name="instructions"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Instructions</FormLabel>
								<FormControl>
									<Textarea
										disabled={isLoading}
										rows={7}
										className="bg-background resize-none"
										placeholder={PREAMBLE}
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Describe in detail your companion&apos;s backstory and
									relevant details.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* EXAMPLE CONVERSATION */}
					<FormField
						name="seed"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Example Conversation</FormLabel>
								<FormControl>
									<Textarea
										disabled={isLoading}
										rows={7}
										className="bg-background resize-none"
										placeholder={SEED_CHAT}
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Write couple of examples of a human chatting with your AI
									companion, write expected answers.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="w-full flex justify-center">
						<Button size="lg" disabled={isLoading}>
							{companion ? "Edit your companion" : "Create your companion"}
							<Wand2 className="w-4 h-4 ml-2" />
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}

export default CompanionForm
