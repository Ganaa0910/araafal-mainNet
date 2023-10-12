import Image from "next/image"
import Link from "next/link"
export default function ActiceRaffles = () => {
  return(
    <div className="max-w-[1400px] mx-auto bg-red-800">
          <div className="py-[48px] md:py-[64px] px-4 md:px-[40px] w-full grid grid-cols-1 gap-8 justify-start items-center">
            <div className="grid grid-cols-4 gap-4">
              {data?.map((ins) => (
                <Link key={ins.id} href={`/raffles/${ins.id}`}>
                  <div className="flex flex-col h-full w-full border border-gray-50 rounded-xl items-center">
                    <div className="mb-4">
                      <Image
                        src={ins.inscriptionPreviewUrl}
                        alt="Profile"
                        height={100}
                        width={100}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-xl font-semibold mb-2">{ins.name}</div>
                    <div className="text-gray-500 text-sm">
                      {ins.inscriptionId}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {/* <div className="flex flex-col md:flex-row gap-9">
          <ViewInscription />
          <InfoSection />
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          <InscriptionDetails />
          <BuyPanel tokens={tokens} />
          <Leaderboard tokens={tokens} getAddressDetail={getAddressDetail} />
        </div> */}
          </div>
        </div>
  )
}