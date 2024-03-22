import prismadb from "@/lib/prismadb"
import { auth, redirectToSignIn } from "@clerk/nextjs"
import CompanionForm from "../_components/companion-form"

interface CompanionIdPageProps {
	params: {
		companionId: string
	}
}

const CompanionIdPage = async ({ params }: CompanionIdPageProps) => {
	//console.log(params) {companionId: new}

	const { userId } = auth()

	// TODO: Add logic to check if the current user has an active subscription.

	if (!userId) {
		return redirectToSignIn()
	}

	const companion = await prismadb.companion.findUnique({
		where: {
			// id from db === id from url
			id: params.companionId,
		},
	})

	const categories = await prismadb.category.findMany()

	return (
		<>
			<CompanionForm categories={categories} companion={companion} />
		</>
	)
}

export default CompanionIdPage
