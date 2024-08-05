import { useState, useRef, useEffect } from 'react';
import BusChild from "../../components/teacher/bus/BusChild";
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { startWebSocket, stopWebSocket } from '../../api/webSocket';
import { getBusstop, getOneBusstopInfo } from '../../api/bus';
import { getTeacherInfo } from '../../api/Info'
import { useBusStore } from '../../stores/useBusStore';

interface Child {
    childName: string; 
    parentTel: string; 
    status: string;    
    checked: string;   
}

interface Bus {
    busStopId: number; 
    busStopName: string; 
    children: Child[]; 
}

export default function TeacherBus() {
    const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('등원');
    const [currentStopIndex, setCurrentStopIndex] = useState(0);
    const [busItems, setBusItems] = useState<Bus[]>([]);
    const [currentBusChildren, setCurrentBusChildren] = useState<Child[]>([]);
    const [isWebSocketActive, setIsWebSocketActive] = useState(() => {
        return JSON.parse(localStorage.getItem('isWebSocketActive') || 'false');
    });

    const { busInfo, setBusInfo, updateChildChecked } = useBusStore((state) => ({
        busInfo: state.busInfo,
        setBusInfo: state.setBusInfo,
        updateChildChecked: state.updateChildChecked,
    }));

    useEffect(() => {
        async function fetchTeacherInfo() {
            try {
                const fetchedTeacherInfo = await getTeacherInfo();
                if (fetchedTeacherInfo.kindergartenId) {
                    // Fetch bus stops for the fetched kindergartenId
                    console.log("id: ", fetchedTeacherInfo.kindergartenId)
                    const busstopData = await getBusstop(fetchedTeacherInfo.kindergartenId);
                    setBusItems(busstopData);
                    if (busstopData.length > 0) {
                        const busInfo = {
                            busStopId: busstopData[0].busStopId,
                            busStopName: busstopData[0].busStopName,
                            children: busstopData[0].children.map(child => ({
                                ...child,
                                checked: 'F', // 초기 체크 상태를 'F'로 설정
                            })),
                        };
                        setBusInfo(busInfo);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch teacher info or bus stops:', error);
            }
        }

        fetchTeacherInfo();
    }, [setBusInfo]);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleUnload = () => {
            localStorage.removeItem('isWebSocketActive');
        };

        window.addEventListener('beforeunload', handleUnload);
        window.addEventListener('unload', handleUnload);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('beforeunload', handleUnload);
            window.removeEventListener('unload', handleUnload);
        };
    }, []);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    const fetchBusChildren = async (busstopId: number) => {
        try {
            const children = await getOneBusstopInfo(busstopId);
            setCurrentBusChildren(children);
        } catch (error) {
            console.error("버스 정류장에 해당하는 아이들을 조회하는 중 오류 발생", error);
        }
    };

    useEffect(() => {
        if (busItems.length > 0 && currentStopIndex < busItems.length) {
            fetchBusChildren(busItems[currentStopIndex].busStopId);
        }
    }, [currentStopIndex, busItems]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    const handlePrevStop = () => {
        setCurrentStopIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleNextStop = () => {
        setCurrentStopIndex((prevIndex) => Math.min(prevIndex + 1, busItems.length - 1));
    };

    const startWebSocketConnection = () => {
        startWebSocket(WEBSOCKET_URL);
        setIsWebSocketActive(true);
        localStorage.setItem('isWebSocketActive', 'true');
    };

    const stopWebSocketConnection = () => {
        stopWebSocket();
        setIsWebSocketActive(false);
        localStorage.setItem('isWebSocketActive', 'false');
    };

    return (
        <>
            <TeacherHeader />
            <div className="mt-[120px] px-[150px]">
                <NavigateBack backPage="홈" backLink='/' />
                <Title title="등하원관리" />
                <div ref={dropdownRef} className="absolute top-[180px] left-[150px] rounded-[10px] border-[1px] border-[#7C7C7C] w-[86px]">
                    <button className="text-[18px] flex flex-row items-center justify-center p-2" onClick={toggleDropdown}>
                        <IoMdArrowDropdown className="text-[18px] mr-2" />{selectedOption}
                    </button>
                    {isOpen && (
                        <div className="absolute left-0 mt-1 w-[86px] rounded-[10px] border-[1px] border-[#7C7C7C] bg-white">
                            <div className="py-1" role="none">
                                <a href="#" className="text-[18px] block px-4 py-2 text-sm text-center text-gray-700" role="menuitem" onClick={() => handleOptionClick('등원')}>등원</a>
                                <a href="#" className="text-[18px] block px-4 py-2 text-sm text-center text-gray-700" role="menuitem" onClick={() => handleOptionClick('하원')}>하원</a>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <div className={`w-[210px] h-[330px] ${currentStopIndex > 0 ? 'bg-[#F4F8ED]' : 'bg-transparent'} rounded-[20px] flex items-center justify-center font-bold text-[24px]`}>
                        {currentStopIndex > 0 ? busItems[currentStopIndex - 1]?.busStopName : ''}
                    </div>
                    <MdNavigateBefore className={`${currentStopIndex <= 0 && 'invisible'} text-[50px] text-[#8CAD1E] cursor-pointer`} onClick={handlePrevStop} />
                    <div className="bg-[#D5E4B4] rounded-[20px] w-[420px] h-[510px] p-[20px] m-4">
                        <p className="font-bold text-[24px] text-center mb-3">{busItems[currentStopIndex]?.busStopName}</p>
                        <div className="bg-[#fff] rounded-[10px] w-[380px] h-[420px] m-1 p-3">
                            <div className="flex flex-row my-1">
                                <div className="flex items-center justify-center font-bold w-[280px]">탑승자</div>
                                <div className="flex items-center justify-center font-bold w-[60px]">탑승여부</div>
                            </div>
                            <div className="w-[360px] h-[370px] overflow-auto custom-scrollbar">
                                {currentBusChildren.length === 0 ? (
                                    <p className="text-3xl text-center text-gray-500 mt-20">탑승인원이 없습니다.</p>
                                ) : (
                                    currentBusChildren.map(({ childName, parentTel, status, checked }, idx) => (
                                        <BusChild key={childName + idx} childName={childName} parentTel={parentTel} status={status} checked={checked} />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    <MdNavigateNext className={`${currentStopIndex >= busItems.length - 1 && 'invisible'} text-[50px] text-[#8CAD1E] cursor-pointer`} onClick={handleNextStop} />
                    <div className={`w-[210px] h-[330px] ${currentStopIndex < busItems.length - 1 ? 'bg-[#F4F8ED]' : 'bg-transparent'} rounded-[20px] flex items-center justify-center font-bold text-[24px]`}>
                        {currentStopIndex < busItems.length - 1 ? busItems[currentStopIndex + 1]?.busStopName : ''}
                    </div>
                </div>
                <button onClick={isWebSocketActive ? stopWebSocketConnection : startWebSocketConnection} className="mt-4 bg-blue-500 text-white p-2 rounded">
                    {isWebSocketActive ? 'Stop WebSocket' : 'Start WebSocket'}
                </button>
            </div>
        </>
    );
}
