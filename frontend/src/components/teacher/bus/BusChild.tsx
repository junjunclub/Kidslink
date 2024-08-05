import React from 'react';
import { useBusStore } from '../../../stores/useBusStore'

// BusChildProps 인터페이스에 checked 추가
export interface BusChildProps {
  childName: string;
  parentTel: string;
  status: string;
  checked: string;
}

const BusChild: React.FC<BusChildProps> = ({ childName, parentTel, status, checked }) => {
  const { updateChildChecked } = useBusStore((state) => ({
    updateChildChecked: state.updateChildChecked,
  }));

  const handleCheckChange = () => {
    // 체크 상태를 반전시키고 Zustand 스토어에 업데이트
    const newCheckedState = checked === 'T' ? 'F' : 'T';
    updateChildChecked(childName, newCheckedState);
  };

  return (
    <div className="flex items-center justify-between py-2 px-3 border-b">
      <div className="flex flex-col">
        <span>{childName}</span>
        <span className="text-sm text-gray-500">{parentTel}</span>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={checked === 'T'}
          onChange={handleCheckChange}
        />
      </div>
    </div>
  );
};

export default BusChild;
