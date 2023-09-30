import Image from 'next/image'
import Button from '../Button'
const Choose = ({ handleClose, show, children }) => {
  const showHideClassName = show
    ? 'fixed inset-0 flex items-center justify-center z-50'
    : 'hidden'

  return (
    <div className={showHideClassName}>
      <div className="w-full h-full  mx-auto rounded shadow-lg z-50 justify-center content-center">
        <div className="w-[60%] h-[70%] mx-auto bg-black border-2 border-lightGray rounded-xl flex flex-col">
          <h1>Choose Inscription</h1>
          <div className="w-full h-full grid grid-cols-4 gap-8 overflow-auto text-center">
            <div className="w-auto h-auto flex flex-col">
              <Image
                className="w-full h-auto"
                src="/bitcoinbandit.svg"
                alt="Card"
                height={1}
                width={1}
              />
              <div className="">
                <div className="font-bold text-xl">Pepe punk</div>
                <p className="text-gray-700 text-base">NO12</p>
              </div>
            </div>
          </div>
          <div className="w-full h-auto flex  justify-end  flex-row">
            <Button onClick={handleClose} className="modal-close mt-5">
              Cancel
            </Button>
            <Button onClick={handleClose} className="modal-close mt-5">
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Choose
