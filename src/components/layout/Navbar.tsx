import Image from "next/image";
import Link from "next/link";
import ConnectWalletButton from "../ConnectWalletButton";
import Router from "next/router";

export default function Navbar() {
  return (
    <nav className="sticky top-0 w-full backdrop-blur-sm bg-opacity-80">
      <div className="flex items-center z-50 justify-center flex-shrink-0 h-20 px-28 max-w-[1440px] mx-auto">
        <div className="left-0 right-auto flex items-center h-12">
          <Link href={"/"}>
            <Image
              className="h-[40px] w-[162px]"
              src={"/araafal.svg"}
              height={48}
              width={160}
              alt="araafal"
            />
          </Link>
        </div>
        <div className="flex items-center gap-3 mx-auto">
          <Link className="px-5 py-3" href={"/createraffle"}>
            CreateRaffle
          </Link>

          <Link className="px-5 py-3" href={"/raffles"}>
            Raffles
          </Link>
        </div>
        <div className="right-0 left-auto hidden md:block">
          <div className="flex items-center gap-8">
            <div className="flex flex-row"></div>

            <div className="hidden md:block">
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// import Image from "next/image";

// import discordIcon from "../../public/discordIcon.svg";
// import logoType from "../../public/logoType.svg";
// import transparentLogo from "../../public/transparentLogo.png";
// import twitterIcon from "../../public/twitterIcon.svg";

// import Link from "next/link";
// import ConnectWalletButton from "./ConnectWalletButton";

// export default function Navbar() {
//   return (
//     <>
//       <nav className="bg-[#000000] bg-opacity-30">
//         <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-20 px-8">
//             <Link href={"/"}>
//               <div className="flex items-center h-12 select-none">
//                 <Image
//                   className="w-8 h-8 cursor-pointer"
//                   src={transparentLogo}
//                   alt="Logo"
//                 />
//                 <Image
//                   src={logoType}
//                   className="ml-2.5 cursor-pointer"
//                   alt="Logo type"
//                 />
//               </div>
//             </Link>
//             <Link href={"/createraffle"}>CreateRaffle</Link>
//             <div className="hidden md:block">
//               <div className="flex items-center gap-8">
//                 <div className="flex flex-row">
//                   <Image
//                     src={twitterIcon}
//                     className="m-2.5 cursor-pointer"
//                     alt="Twitter icon"
//                     onClick={() => {
//                       window.open(
//                         "https://twitter.com/SatoshiPunksNFT/",
//                         "_blank",
//                       );
//                     }}
//                   />
//                   <Image
//                     src={discordIcon}
//                     className="m-2.5 cursor-pointer"
//                     alt="Discord icon"
//                     onClick={() => {
//                       window.open(
//                         "https://discord.gg/satoshipunksnft",
//                         "_blank",
//                       );
//                     }}
//                   />
//                 </div>

//                 <div className="hidden md:block">
//                   <ConnectWalletButton />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// }
