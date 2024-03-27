import prismadb from "@/lib/prismadb"
import { auth, currentUser } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
	req: Request,
	{ params }: { params: { companionId: string } }
) {
	try {
		const body = await req.json()
		const user = await currentUser()
		// destructuring necessary data from body
		const { src, name, description, instructions, seed, categoryId } = body

		if (!params.companionId) {
			return new NextResponse("Missing companionId", { status: 400 })
		}

		if (!user || !user.id || !user.firstName) {
			return new NextResponse("Unauthorized", { status: 401 })
		}
		if (
			!src ||
			!name ||
			!description ||
			!instructions ||
			!seed ||
			!categoryId
		) {
			return new NextResponse("Missing required fields", { status: 400 })
		}

		// TODO: check for subscription

		const companion = await prismadb.companion.update({
			where: {
				id: params.companionId,
				userId: user.id,
			},
			data: {
				userId: user.id,
				userName: user.firstName,
				categoryId,
				name,
				description,
				instructions,
				seed,
				src,
			},
		})
		// return created companion
		return NextResponse.json(companion)
	} catch (error) {
		console.log("[COMPANION_PATCH]", error)
		return new NextResponse("Internal Server Error", { status: 500 })
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { companionId: string } }
) {
	try {
		const { userId } = auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const companion = await prismadb.companion.delete({
			where: {
				userId,
				id: params.companionId,
			},
		})

		return NextResponse.json(companion)
	} catch (error) {
		console.log("[COMPANION_DELETE]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
