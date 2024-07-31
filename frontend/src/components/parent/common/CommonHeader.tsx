import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import AlaramBell from './AlaramBell';

interface CommonHeaderProps {
  title: string;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 뒤로가기
  };


  return (
    <div className="z-50 fixed top-0 w-full h-[67px] border-b bg-white border-gray-300 p-4 shadow-md flex items-center justify-between">
      <button onClick={handleBack} className="flex items-center justify-center w-10 h-10">
        <FaArrowLeft className="w-6 h-6  text-gray-700" />
      </button>
      <p className="text-[22px] font-bold text-[#212121]">
        {title}
      </p>
      <AlaramBell />
    </div>
  );
};

export default CommonHeader;
