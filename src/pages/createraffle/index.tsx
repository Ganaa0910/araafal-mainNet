import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import Choose from '@/components/create-raffle/choose'
import Image from 'next/image'
export default function CreateRaffle() {
  const [showInscriptions, setShowInscriptions] = useState(false)

  const toggleInscriptions = () => {
    setShowInscriptions(!showInscriptions)
  }
  const [selectedDate, setSelectedDate] = useState(null)

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }
  return (
    <div className="max-w-[1216px] mx-auto h-auto flex flex-col">
      <Choose show={showInscriptions} handleClose={toggleInscriptions}></Choose>
      <div className="">Create Raffle</div>
      <div className="w-full h-[544px] flex flex-row gap-8">
        <div
          className="w-1/3 flex flex-col justify-center items-center h-5/6 border-2 border-lightGray rounded-xl"
          onClick={toggleInscriptions}
        >
          <Image src={'/nft.svg'} width={96} height={96}></Image>
          <h1 className=" text-2xl text-center">
            Click here to <br /> choose inscription
          </h1>
        </div>
        <div className="w-2/3 h-full  flex flex-row gap-8">
          <div className="w-2/3 h-5/6 flex flex-col gap-8">
            <div className="w-full h-1/3 border-2 border-lightGray rounded-xl flex flex-col p-4">
              <h1>Ticket price</h1>
              <div className="flex flex-row w-full h-1/2 mb-0 mt-auto justify-between">
                <div className="flex flex-row items-center justify-center gap-4">
                  <Image
                    src="/bitcoin.svg"
                    alt="Your Image"
                    width={32}
                    height={32}
                    className="w-10 h-10"
                  />
                  <h2 className="font-bold text-xl">BTC</h2>
                </div>
                <div className="ml-4">
                  <input
                    type="text"
                    placeholder="Enter an amount"
                    className="border border-gray-300 rounded px-4 py-2 mt-2 bg-black"
                  />
                </div>
              </div>
            </div>
            <div className="w-full h-2/3  flex flex-col p-10 border-2 border-lightGray rounded-xl gap-4">
              <h1 className="text-2xl">Description</h1>
              <input className="w-full h-full bg-transparent border-2 rounded-xl"></input>
            </div>
          </div>
          <div className="w-1/3 h-full flex flex-col gap-8">
            <div className="w-full h-2/5 border-2 border-lightGray rounded-xl">
              <div className="flex flex-col justify-between gap-4 items-center">
                <h1 className="text-xl mt-8">End Date</h1>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="border p-2 rounded w-full"
                />
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
            <div className="w-full h-1/8 ">
              <button
                className={`text-base w-full h-full bg-defaultGray border-lightGray px-[16px] py-[12px] h-[48px] hover:border-white`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
