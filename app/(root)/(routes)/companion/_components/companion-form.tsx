"use client"

import * as z from "zod"

import { Category, Companion } from "@prisma/client"
import { useForm } from "react-hook-form"

import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"

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
					<div className="space-y-2 w-full col-span-2">
						<div>
							<h3 className="text-lg font-medium">General Information</h3>
							<p className="text-sm text-muted-foreground">
								General Information about your companion
							</p>
						</div>
						<Separator />
					</div>
				</form>
			</Form>
		</div>
	)
}

export default CompanionForm