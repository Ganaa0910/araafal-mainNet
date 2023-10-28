import Image from "next/image";
import { Button } from "../ui/button";
import { useState } from "react";

const Choose = ({
  handleClose,
  show,
  inscriptions,
  setChosenInscription,
  chosenInscription,
}) => {
  console.log(
    "🚀 ~ file: Choose.tsx:10 ~ Choose ~ inscriptions:",
    inscriptions,
  );
  const [selectedCards, setSelectedCards] = useState({});

  const showHideClassName = show
    ? "fixed inset-0 flex items-center justify-center z-50"
    : "hidden";

  const confirmation = () => {
    setChosenInscription(selectedCards);
    handleClose();
  };

  return (
    <div className={showHideClassName}>
      <div className="z-50 content-center justify-center w-full h-full mx-auto rounded shadow-lg">
        <div className="w-[60%]  mx-auto p-4 bg-black border-2 border-lightGray rounded-xl flex flex-col select-none">
          <h1>Choose Inscription</h1>
          <div className="grid w-full h-full grid-cols-3 gap-4 overflow-auto text-center ">
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
                  className="w-full rounded-md"
                  src={`https://testnet.ordinals.com/content/${ins.inscriptionId}`}
                  alt="Card"
                  height={100}
                  width={100}
                />
                {/* <div className="">
                  <div className="text-xl font-bold">Pepe punk</div>
                  <p className="text-base text-gray-700">NO12</p>
                </div> */}
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-end w-full h-auto gap-2">
            <Button onClick={handleClose} className="mt-5 modal-close">
              Cancel
            </Button>
            <Button onClick={confirmation} className="mt-5 modal-close">
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choose;
