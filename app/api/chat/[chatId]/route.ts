// Imports the PineconeClient class to interact with the Pinecone vector database.
import { PineconeClient } from "@pinecone-database/pinecone"
// Imports the Redis class from @upstash/redis package to work with Redis data store.
import { Redis } from "@upstash/redis"
// Imports the OpenAIEmbeddings class to transform text into numerical vectors using OpenAI models.
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
// Imports PineconeStore, although in the provided snippet, it is deprecated.
import { PineconeStore } from "langchain/vectorstores/pinecone"

// Defines the structure for a companion key that ties a user to a specific companion and model.
export type CompanionKey = {
	companionName: string
	modelName: string
	userId: string
}

// MemoryManager class to handle the history of chats and vector searching.
export class MemoryManager {
	private static instance: MemoryManager // Singleton instance of MemoryManager.
	private history: Redis // Redis client for handling chat history.
	private vectorDBClient: PineconeClient // Pinecone client for vector database operations.

	// Constructor initializes Redis and Pinecone clients.
	public constructor() {
		this.history = Redis.fromEnv()
		this.vectorDBClient = new PineconeClient()
	}

	// Initializes the Pinecone client with the provided API key and environment settings.
	public async init() {
		if (this.vectorDBClient instanceof PineconeClient) {
			await this.vectorDBClient.init({
				apiKey: process.env.PINECONE_API_KEY!,
				environment: process.env.PINECONE_ENVIRONMENT!,
			})
		}
	}

	// Searches the vector database for documents similar to the recent chat history.
	public async vectorSearch(
		recentChatHistory: string,
		companionFileName: string
	) {
		const pineconeClient = this.vectorDBClient as PineconeClient

		const pineconeIndex = pineconeClient.Index(
			process.env.PINECONE_INDEX! || ""
		)

		// Initializes a vector store for the searching, using existing index and OpenAI embeddings.
		const vectorStore = await PineconeStore.fromExistingIndex(
			new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
			{ pineconeIndex }
		)

		// Search for documents similar to recentChatHistory and catch any errors.
		const similarDocs = await vectorStore
			.similaritySearch(recentChatHistory, 3, { fileName: companionFileName })
			.catch(err => {
				console.log("WARNING: failed to get vector search results.", err)
			})
		return similarDocs
	}

	// Ensures a singleton instance of the MemoryManager class.
	public static async getInstance(): Promise<MemoryManager> {
		if (!MemoryManager.instance) {
			MemoryManager.instance = new MemoryManager()
			await MemoryManager.instance.init()
		}
		return MemoryManager.instance
	}

	// Generates a unique Redis key based on the companion key information.
	private generateRedisCompanionKey(companionKey: CompanionKey): string {
		return `${companionKey.companionName}-${companionKey.modelName}-${companionKey.userId}`
	}

	// Writes text to the user's chat history in Redis.
	public async writeToHistory(text: string, companionKey: CompanionKey) {
		if (!companionKey || typeof companionKey.userId == "undefined") {
			console.log("Companion key set incorrectly")
			return ""
		}

		const key = this.generateRedisCompanionKey(companionKey)
		// Add the text to the sorted set in Redis, with the score as the current timestamp.
		const result = await this.history.zadd(key, {
			score: Date.now(),
			member: text,
		})

		return result
	}

	// Reads up to the last 30 messages from the user's chat history in Redis.
	public async readLatestHistory(companionKey: CompanionKey): Promise<string> {
		if (!companionKey || typeof companionKey.userId == "undefined") {
			console.log("Companion key set incorrectly")
			return ""
		}

		const key = this.generateRedisCompanionKey(companionKey)
		// Retrieve the messages, sort by score, and limit to the most recent 30 entries.
		let result = await this.history.zrange(key, 0, Date.now(), {
			byScore: true,
		})

		// Reverse the order to get the latest chats first and join them into a single string.
		result = result.slice(-30).reverse()
		const recentChats = result.reverse().join("\n")
		return recentChats
	}

	// Initializes a user's chat history in Redis with seed content, if not already present.
	public async seedChatHistory(
		seedContent: String,
		delimiter: string = "\n",
		companionKey: CompanionKey
	) {
		const key = this.generateRedisCompanionKey(companionKey)
		if (await this.history.exists(key)) {
			console.log("User already has chat history")
			return
		}

		// Split the seed content by the delimiter and add each part to Redis sorted set.
		const content = seedContent.split(delimiter)
		let counter = 0
		for (const line of content) {
			// Each line is added as a member of the sorted set with an incrementing score.
			await this.history.zadd(key, { score: counter, member: line })
			counter += 1
		}
	}
}
