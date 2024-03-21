import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="h-full">
			<Navbar />
			<div className="hidden md:flex mt-16 w-20 flex-col inset-y-0 fixed ">
				<Sidebar />
			</div>
			<main className=" h-full md:pl-20 pt-16">{children}</main>
		</div>
	)
}

export default RootLayout
