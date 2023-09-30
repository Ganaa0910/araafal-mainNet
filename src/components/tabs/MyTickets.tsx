import Button from "@/components/Button"
import Image from "next/image"
import { useRouter } from "next/router"
const tic = () => {
     //profile routing
     const Buttons = [
        {
            title: `My Inscriptions`,
            href: `/ins`,
        },
        {
            title: `My Created Raffles`,
            href: `/raf`,
        },
        {   
            title: `My Tickets`,
            href: `/tic`,
        },
    ]
    //profile routing ends
    const router = useRouter()

    

    const slug = router.query.addr
    return (
        <div className="max-w-[1216px] mx-auto flex flex-row">
            <div className=" flex flex-row gap-4 h-auto w-full">
                <div className="flex flex-col w-[280px] h-auto gap-8">
                    <div className="flex flex-col w-full h-auto gap-[12px] p-[12px] border-lighterGray border rounded-xl">
                        <div className="flex flex-row items-center justify-center p-[12px] border border-lightGray rounded-lg">
                            <div className="w-[30%]">
                                <Image
                                    src="/profile.svg"
                                    alt="Profile"
                                    width={72}
                                    height={72}
                                    className="w-18 h-18 rounded-full mr-4"
                                />
                            </div>

                            <div className="w-[70%]">
                                <p>wallet address</p>
                            </div>
                        </div>
                        {/* <Button>My inscriptions</Button>
                        <Button>My Created Raffles</Button>
                        <Button>My Tickets</Button> */}
                        {Buttons.map((button, index) => (
                            <Button
                                customStyle={''}
                                key={index}
                                onClick={() => router.push(button.href)}
                            >
                                {button.title}
                            </Button>
                        ))}
                    </div>
                    <Button>Log out</Button>
                </div>


                <div className="w-[904px] h-[694px] flex flex-col border border-gray-50 rounded-lg px-6 pt-5 pb-6 gap-5 overflow-auto">
                        <div className="text-grey-300 text-2xl">My inscriptions</div>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="flex flex-col h-[280px] w-[202px] border border-gray-50 rounded-xl items-center">
                                <div className="mb-4">
                                    <img
                                        src="/pepepunks.svg"
                                        alt="Profile"
                                        className="w-[202px] h-[202px]"
                                    />
                                </div>
                                <div className="text-xl font-semibold mb-2">Pepe Punks</div>
                                <div className="text-gray-500 text-sm">NO. 9769</div>
                            </div>
                        </div>
                </div>
            </div>
            
        </div>
        
    )
}
export default tic
