const Claim = (children, onClick) => {
  return (
    <button
      className={`text-base bg-defaultGray border-lightGray px-[16px] py-[12px] h-[48px] hover:border-white`}
    >
      {children}
    </button>
  )
}
export default Claim
