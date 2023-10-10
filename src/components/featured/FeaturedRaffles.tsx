import Raffles from "./Raffles";
const FeaturedRaffles = () => {
  return (
    <div className="w-[1216px] mx-auto flex flex-col">
      <div className="flex flex-col mb -12">
        <h1 className="text-featuredRaffles text-4xl">Featured raffles</h1>
        <span className="bg-gradient-to-r from-cyan-500 to-blue-500 inline-block w-24 h-2"></span>
      </div>

      <Raffles></Raffles>
    </div>
  );
};
export default FeaturedRaffles;
