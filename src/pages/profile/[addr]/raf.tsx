
import { useRouter } from 'next/router'

import Button from '@/components/Button'
import MyCreatedRaffles from '@/components/tabs/MyCreatedRaffles'
import Image from 'next/image'

export default function raf() {
    //profile routing
    const Buttons = [
        {
            title: `My Inscriptions`,
            href: `/profile/ins`,
        },
        {
            title: `My Created Raffles`,
            href: `/profile/raf`,
        },
        {   
            title: `My Tickets`,
            href: `/profile/tic`,
        },
    ]
    //profile routing ends
    const router = useRouter()

    

    const slug = router.query.addr

    

    

    return (
        <div className="max-w-[1216px] mx-auto">
            {/* <div className="py-[48px] md:py-[64px] px-4 md:px-[40px] w-full grid grid-cols-1 gap-8 justify-start items-center bg-red-600"> */}
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

             
                <MyCreatedRaffles></MyCreatedRaffles>

          
            </div>
        </div>
    )
}
