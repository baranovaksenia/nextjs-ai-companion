"use client"

import { cn } from "@/lib/utils"
import { Category } from "@prisma/client"
import { useRouter, useSearchParams } from "next/navigation"

import qs from "query-string"

interface CategoriesProps {
	categories: Category[] //id: string; name: string
}

const Categories = ({ categories }: CategoriesProps) => {
	const router = useRouter()
	const searchParams = useSearchParams()

	const categoryId = searchParams.get("categoryId")

	const onClick = (id: string | undefined) => {
		const query = {
			categoryId: id,
		}

		const url = qs.stringifyUrl(
			{
				url: window.location.href,
				query: query,
			},
			{
				skipNull: true,
			}
		)
		router.push(url)
	}

	return (
		<div className="w-full overflow-x-auto space-x-2 flex p-1">
			{/* reset categories button */}
			<button
				onClick={() => onClick(undefined)}
				className={cn(
					`flex items-center justify-center text-sm md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition`
				)}
			>
				Newest
			</button>
			{categories.map(category => (
				<button
					onClick={() => onClick(category.id)}
					key={category.id}
					className={cn(
						`
				
				flex items-center justify-center text-sm md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition
				`,
						category.id === categoryId ? "bg-primary/25" : "bg-primary/10"
					)}
				>
					{category.name}
				</button>
			))}
		</div>
	)
}

export default Categories
