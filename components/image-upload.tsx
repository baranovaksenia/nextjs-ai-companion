"use client"

import { CldUploadButton } from "next-cloudinary"
import Image from "next/image"
import { useEffect, useState } from "react"

interface ImageUploadProps {
	value: string
	onChange: (src: string) => void
	disabled?: boolean
}

const ImageUpload = ({ value, onChange, disabled }: ImageUploadProps) => {
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) return null

	// show this if finish SSR and mounted
	return (
		<div className="space-y-4 w-full flex flex-col justify-center items-center">
			<CldUploadButton
				onSuccess={(result: any) => onChange(result.info.secure_url)}
				options={{
					maxFiles: 1,
				}}
				uploadPreset="dkpns5t9"
			>
				<div className="p-4 border-4 border-dashed border-primary/10 rounded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center">
					<div className="relative h-40 w-40">
						<Image
							fill
							alt="Upload image"
							src={value || "/placeholder.svg"}
							className="object-cover rounded-lg"
						/>
					</div>
				</div>
			</CldUploadButton>
		</div>
	)
}

export default ImageUpload
