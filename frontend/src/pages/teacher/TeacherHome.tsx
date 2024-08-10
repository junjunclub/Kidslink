import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { BiBell } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import useModal from "../../hooks/teacher/useModal";
import { deleteAlarm, deleteAllAlarms, getAlarmCount, getAllAlarms } from "../../api/alarm";
import growthdiaryIcon from "../../assets/teacher/growthdiary_btn_img.png";
import noticeIcon from "../../assets/teacher/notice_btn_img.png";
import albumIcon from "../../assets/teacher/album_btn_img.png";
import documentIcon from "../../assets/teacher/document_btn_img.png";
import busIcon from "../../assets/teacher/bus_btn_img.png";
import consultingIcon from "../../assets/teacher/consulting_btn_img.png";
import ourClassIcon from "../../assets/teacher/document_btn_img.png";
import scheduleIcon from "../../assets/teacher/document_btn_img.png";

interface Alarm {
    id: number;
    contents: string;
    date: string;
    code: string;
}

export default function TeacherHome() {
    const { openModal, closeModal, Modal, isModalOpen } = useModal();
    const [alertList, setAlertList] = useState<Alarm[]>([]);
    const [alertNum, setAlertNum] = useState(0);
    const [activeMenu, setActiveMenu] = useState('ourclass');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // 알림 목록 가져오기
    const fetchAlarmList = async () => {
        const fetchedAlarmList = await getAllAlarms();
        const sortedAlarmList = fetchedAlarmList.sort((a, b) => b.id - a.id);
        setAlertList(sortedAlarmList);
    };

    // 알림 개수 가져오기
    const fetchAlarmCount = async () => {
        setAlertNum(await getAlarmCount());
    };

    useEffect(() => {
        fetchAlarmList();
        fetchAlarmCount();
    }, []);

    // 개별 알림 삭제
    const deleteItem = async (id: number) => {
        await deleteAlarm(id);
        await fetchAlarmList();
        await fetchAlarmCount();
    };

    // 전체 알림 삭제
    const deleteAllItems = async () => {
        await deleteAllAlarms();
        await fetchAlarmList();
        await fetchAlarmCount();
    };

    let navigate = useNavigate();

    // 알림 클릭 시 이동 처리
    const handleClick = (code: string) => {
        return (event: React.MouseEvent<HTMLDivElement>) => {
            if (code === "DOCUMENT") {
                navigate('/document');
            } else if (code === "MEETING") {
                navigate('/meeting/scheduled');
            } else {
                navigate('/');
            }
        };
    };

    // 모달 콘텐츠 렌더링
    const renderModalContent = useCallback(() => (
        <div className="lg:w-[430px] w-[320px] max-h-[450px] p-2">
            <div className="flex flex-row justify-between">
                <div className="text-[23px] font-bold mb-4">알림 목록</div>
                {alertList.length > 0 &&
                    <button
                        className="mb-4 px-3.5 py-2 rounded-lg flex flex-row items-center bg-[#DF6767] text-white"
                        onClick={async () => {
                            await deleteAllItems();
                        }}
                    >
                        <FaRegTrashAlt className="mr-2 text-[16px] font-bold" />
                        전체 삭제
                    </button>
                }
            </div>
            {alertList.length > 0 ? (
                <div className="custom-scrollbar max-h-[380px] overflow-y-auto">
                    {alertList.map((alert, index) => (
                        <div
                            key={index}
                            className="flex flex-row justify-between items-center my-5 cursor-pointer mr-3"
                            onClick={() => handleClick(alert.code)}
                        >
                            <div>
                                <p className="text-[17px] mb-[1px]">{alert.contents}</p>
                                <span className="text-[#B8B8B8] text-[13px]">{alert.date}</span>
                            </div>
                            <FaRegTrashAlt
                                className="text-[18px] cursor-pointer"
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    await deleteItem(alert.id);
                                }}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p>알림이 없습니다.</p>
            )}
        </div>
    ), [alertList]);

    // 알림 모달 열기
    const openAlarmModal = async () => {
        await fetchAlarmList();
        openModal(renderModalContent());
        await fetchAlarmCount();
    };

    useEffect(() => {
        if (isModalOpen) {
            openModal(renderModalContent());
        }
        return () => {
            fetchAlarmCount();
        };
    }, [alertList, isModalOpen]);

    // 메뉴 이름을 제목으로 설정하는 함수
    const getMenuTitle = () => {
        switch (activeMenu) {
            case 'ourclass':
                return '우리반 보기';
            case 'schedule':
                return '일정관리';
            case 'album':
                return '사진분류';
            case 'bus':
                return '등하원 관리';
            case 'meeting':
                return '화상 상담';
            case 'notice':
                return '알림장';
            case 'growth':
                return '성장일지';
            case 'document':
                return '문서관리';
            default:
                return '제목';
        }
    };

    return (
        <>
            {/* 왼쪽 사이드바 */}
            <div className="flex min-h-screen">
                <aside className={`fixed h-full shadow-lg transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} w-60 bg-white py-6`}>
                    {/* 로고 */}
                    <Link to="/" className="flex items-center mb-8 pl-8">
                        <p className="text-[36px] font-bold text-left font-Cafe24Ssurround gradient-text cursor-pointer">키즈링크</p>
                    </Link>
                    <div className="flex flex-col space-y-4">
                        <Link to="/ourclass" className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'ourclass' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`} onClick={() => setActiveMenu('ourclass')}>
                            <img src={ourClassIcon} alt="우리반 보기" className="w-6 h-6 mr-3" />
                            <span className="text-gray-700 font-medium">우리반 보기</span>
                        </Link>
                        <Link to="/schedule" className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'schedule' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`} onClick={() => setActiveMenu('schedule')}>
                            <img src={scheduleIcon} alt="일정관리" className="w-6 h-6 mr-3" />
                            <span className="text-gray-700 font-medium">일정관리</span>
                        </Link>
                        <Link to="/album" className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'album' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`} onClick={() => setActiveMenu('album')}>
                            <img src={albumIcon} alt="사진분류" className="w-6 h-6 mr-3" />
                            <span className="text-gray-700 font-medium">사진분류</span>
                        </Link>
                        <Link to="/bus" className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'bus' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`} onClick={() => setActiveMenu('bus')}>
                            <img src={busIcon} alt="등하원 관리" className="w-6 h-6 mr-3" />
                            <span className="text-gray-700 font-medium">등하원 관리</span>
                        </Link>
                        <Link to="/meeting" className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'meeting' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`} onClick={() => setActiveMenu('meeting')}>
                            <img src={consultingIcon} alt="화상 상담" className="w-6 h-6 mr-3" />
                            <span className="text-gray-700 font-medium">화상 상담</span>
                        </Link>
                        <Link to="/notice" className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'notice' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`} onClick={() => setActiveMenu('notice')}>
                            <img src={noticeIcon} alt="알림장" className="w-6 h-6 mr-3" />
                            <span className="text-gray-700 font-medium">알림장</span>
                        </Link>
                        <Link to="/growth" className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'growth' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`} onClick={() => setActiveMenu('growth')}>
                            <img src={growthdiaryIcon} alt="성장일지" className="w-6 h-6 mr-3" />
                            <span className="text-gray-700 font-medium">성장일지</span>
                        </Link>
                        <Link to="/document" className={`flex items-center py-3 pl-8 transition-colors duration-300 bg-left bg-no-repeat bg-[length:200%_100%] ${activeMenu === 'document' ? 'bg-[#FFF9D7] border-r-8 border-[#FFEC8A]' : 'hover:bg-[#FFF9D7] hover:bg-right hover:bg-[length:100%_100%]'}`} onClick={() => setActiveMenu('document')}>
                            <img src={documentIcon} alt="문서관리" className="w-6 h-6 mr-3" />
                            <span className="text-gray-700 font-medium">문서관리</span>
                        </Link>
                    </div>
                </aside>

                {/* 사이드바 토글 버튼 */}
                <div className="fixed bottom-4 left-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-gray-700 bg-white shadow-md rounded-full"
                    >
                        {isSidebarOpen ? <AiOutlineMenuFold size={24} /> : <AiOutlineMenuUnfold size={24} />}
                    </button>
                </div>

                {/* 메인 콘텐츠 영역 */}
                <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-60' : 'ml-0'} p-8 min-h-screen bg-[#F5F5F5]`}>
                    {/* 헤더와 페이지 타이틀 영역 */}
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-semibold text-gray-800">{getMenuTitle()}</h1>
                        <div className="flex items-center">
                            <div className="relative mr-8" onClick={openAlarmModal}>
                                <BiBell className="w-[24px] h-[24px] cursor-pointer text-gray-700" />
                                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                    {alertNum}
                                </span>
                            </div>
                            <Link to='/mypage'>
                                <CgProfile className="w-[24px] h-[24px] cursor-pointer text-gray-700" />
                            </Link>
                        </div>
                    </div>

                    {/* 흰색 박스에 들어갈 페이지 콘텐츠 */}
                    <div className="bg-white shadow-lg rounded-lg p-6 min-h-[300px]">
                        {/* 여기에 페이지별 콘텐츠가 들어갑니다. */}
                        {activeMenu === 'ourclass' && <div>우리반 보기 콘텐츠</div>}
                        {activeMenu === 'schedule' && <div>일정관리 콘텐츠</div>}
                        {activeMenu === 'album' && <div>사진분류 콘텐츠</div>}
                        {activeMenu === 'bus' && <div>등하원 관리 콘텐츠</div>}
                        {activeMenu === 'meeting' && <div>화상 상담 콘텐츠</div>}
                        {activeMenu === 'notice' && <div>알림장 콘텐츠</div>}
                        {activeMenu === 'growth' && <div>성장일지 콘텐츠</div>}
                        {activeMenu === 'document' && <div>문서관리 콘텐츠</div>}
                    </div>
                </main>
            </div>
            <Modal />
        </>
    );
}
