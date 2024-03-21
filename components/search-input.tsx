"use client"
import { useDebounce } from "@/hooks/use-debounce"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import qs from "query-string"
import { ChangeEventHandler, useEffect, useState } from "react"
import { Input } from "./ui/input"

// SearchInput component represents a search textbox that integrates with Next.js
// routing to handle debounced input and URL synchronization for search parameters.
const SearchInput = () => {
	const router = useRouter() // Instance of Next.js routing API.
	const searchParams = useSearchParams() // Access to URL search parameters for retaining the app state.

	// Default search terms extracted from URL if available.
	const name = searchParams.get("name")
	const categoryId = searchParams.get("categoryId")

	// State for the search input value with an optional default from the URL.
	const [value, setValue] = useState(name || "")

	// Debounced value of the input to reduce the frequency of routing updates.
	const debouncedValue = useDebounce<string>(value, 500)

	// Handler to synchronize input state with user's typing.
	const onChange: ChangeEventHandler<HTMLInputElement> = event => {
		setValue(event.target.value)
	}

	// Effect that synchronizes the URL with the debounced search criteria.
	useEffect(() => {
		// if debouncedValue or categoryId changes, the URL's query string is updated.
		const query = {
			name: debouncedValue,
			categoryId: categoryId,
		}
		const url = qs.stringifyUrl(
			{
				url: window.location.href,
				query: query,
			},
			{ skipNull: true, skipEmptyString: true } // Configuration to avoid empty query params.
		)
		router.push(url) // Apply the new URL without reloading the page.
	}, [debouncedValue, router, categoryId])

	return (
		<div className="relative">
			<Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground" />

			<Input
				onChange={onChange}
				value={value}
				className="pl-10 bg-primary/10"
			/>
		</div>
	)
}

export default SearchInput
