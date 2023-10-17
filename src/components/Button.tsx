interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  customStyle?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, customStyle }) => {
  // const Button: React.FC<ButtonProps> = ({ children, onClick, customStyle }) => {
  return (
    <button
      // className={`text-base bg-defaultGray border-lightGray px-[16px] py-[12px] h-[48px] hover:border-white ${customStyle}`}
      className={`text-base bg-defaultGray border-lightGray px-[16px] py-[12px] h-[48px] hover:border-white ${customStyle}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
