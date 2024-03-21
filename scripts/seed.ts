const { PrismaClient } = require("@prisma/client")

const db = new PrismaClient()

async function main() {
	try {
		await db.category.createMany({
			data: [
				{ name: "Keto Expert" },
				{ name: "Lactose Free Expert" },
				{ name: "Gluten Free" },
				{ name: "Pregnancy Nutrition" },
				{ name: "Children Nutrition" },
				{ name: "Vegan" },
				{ name: "Vegetarian" },
				{ name: "Athlete Nutrition" },
				{ name: "Senior Nutrition" },
				{ name: "Diabetic Nutrition" },
			],
		})
	} catch (error) {
		console.error("Error seeding default categories", error)
	} finally {
		await db.$disconnect()
	}
}

main()
