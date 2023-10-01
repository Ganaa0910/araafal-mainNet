import Image from "next/image";
import Button from "../Button";
import { useState } from "react";

const Choose = ({
  handleClose,
  show,
  inscriptions,
  setChosenInscrption,
  chosenInscription,
}) => {
  console.log("🚀 ~ file: Choose.tsx:6 ~ Choose ~ inscriptions:", inscriptions);
  const [selectedCards, setSelectedCards] = useState("");

  const showHideClassName = show
    ? "fixed inset-0 flex items-center justify-center z-50"
    : "hidden";

  const confirmation = () => {
    setChosenInscrption(selectedCards);
    handleClose();
  };

  return (
    <div className={showHideClassName}>
      <div className="w-full h-full  mx-auto rounded shadow-lg z-50 justify-center content-center">
        <div className="w-[60%]  mx-auto p-4 bg-black border-2 border-lightGray rounded-xl flex flex-col">
          <h1>Choose Inscription</h1>
          <div className="w-full h-full grid grid-cols-3 gap-4 overflow-auto text-center ">
            {inscriptions?.map((ins) => (
              <div
                key={ins}
                className={`w-auto  flex flex-col ${
                  selectedCards == ins
                    ? "border border-red-500"
                    : "border border-white"
                }`}
                onClick={() => setSelectedCards(ins)}
              >
                <Image
                  className="w-full  rounded-md"
                  src={`https://testnet.ordinals.com/content/${ins}i0`}
                  alt="Card"
                  height={100}
                  width={100}
                />
                {/* <div className="">
                  <div className="font-bold text-xl">Pepe punk</div>
                  <p className="text-gray-700 text-base">NO12</p>
                </div> */}
              </div>
            ))}
          </div>
          <div className="w-full h-auto flex  justify-end gap-2 flex-row">
            <Button onClick={handleClose} className="modal-close mt-5">
              Cancel
            </Button>
            <Button onClick={() => confirmation()} className="modal-close mt-5">
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choose;
