export default function PageTitle({ name }: { name: string }) {
  return (
    <div className="flex flex-col mb-12 mb -12">
      <h1 className="text-4xl text-featuredRaffles">{name}</h1>
      <span className="inline-block w-24 h-2 bg-gradient-to-r from-orange-300 to-orange-600"></span>
    </div>
  );
}

// import { Button } from "../ui/button";
// import { Icons } from "../ui/icons";
// export default function PageTitle({
//   name,
//   seeAll,
// }: {
//   name: string;
//   seeAll: boolean;
// }) {
//   return (
//     <div className="flex flex-col mb-12 mb -12">
//       <div className="flex justify-between items-center">
//         <h1 className="text-4xl text-featuredRaffles">{name}</h1>
//         {seeAll && (
//           // <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//           //   See All
//           // </button>
// <Button variant={"ghost"}>
//   See all <Icons.chevronRight className="h-4 w-4" />
// </Button>
//         )}
//       </div>
//       <span className="inline-block w-24 h-2 bg-gradient-to-r from-orange-300 to-orange-600"></span>
//     </div>
//   );
// }
