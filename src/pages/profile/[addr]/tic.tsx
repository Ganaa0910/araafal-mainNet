import Button from '@/components/Button'
import Image from 'next/image'
import { useRouter } from 'next/router'
const tic = () => {
  const Claim = () => {
    return (
      <button
        className={`w-[133px] flex flex-row text-center text-2xl  bg-defaultGray border-lightGray px-[16px] py-[12px] h-auto border-white`}
      >
        <Image
          src={'/claim.svg'}
          width={1}
          height={1}
          className="w-6 h-6"
        ></Image>
        Claim
      </button>
    )
  }
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
          <div className="text-grey-300 text-2xl flex justify-between">
            <div className="text-left">Raffle</div>
            <div className="text-center">Quantity</div>
            <div className="text-right">End Time</div>
          </div>
          <hr></hr>
          <div className="w-full h-[116px] border-2 border-lightgray rounded-lg  flex flex-row">
            <div className="w-1/3 flex flex-row">
              <Image
                width={1}
                height={1}
                className="h-full w-auto"
                src={'/bitcoinbandit.svg'}
              ></Image>
              <div className="flex flex-col h-full items-center justify-center">
                <h1>Pepepunk</h1>
                <p>NO12</p>
              </div>
            </div>
            <div className="w-1/3 flex flex-row items-center justify-center text-left">
              <h1>23</h1>
              <Image
                src={'/ticket.svg'}
                width={1}
                height={1}
                className="w-8 h-8"
              ></Image>
            </div>
            <div className="w-1/3 text-left items-end">
              <Claim></Claim>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default tic
