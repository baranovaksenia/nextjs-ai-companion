import Categories from "@/components/categories"
import Companions from "@/components/companions"
import SearchInput from "@/components/search-input"
import prismadb from "@/lib/prismadb"

interface RootPageProps {
	// every server component must have searchParams
	searchParams: {
		categoryId: string
		name: string
	}
}

const RootPage = async ({ searchParams }: RootPageProps) => {
	// console.log(searchParams)
	// {
	// 	categoryId: '500d98dd-0832-4c5a-9835-c7e7ca1f082d',
	// 	name: 'something'
	// }
	const companions = await prismadb.companion.findMany({
		where: {
			categoryId: searchParams.categoryId,
			// schema: name String @db.Text - full text search
			name: {
				search: searchParams.name,
			},
		},
		// newest first
		orderBy: {
			createdAt: "desc",
		},
		// show how many messages companion has
		include: {
			_count: {
				select: {
					messages: true,
				},
			},
		},
	})

	const categories = await prismadb.category.findMany()

	return (
		<div className="h-full p-4 space-y-2">
			<SearchInput />
			<Categories categories={categories} />
			<Companions companions={companions} />
		</div>
	)
}

export default RootPage
