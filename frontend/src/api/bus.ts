import { BusChildProps } from "../components/teacher/bus/BusChild"
import axiosInstance from "./token/axiosInstance"

// 학부모 버스 탑승 여부 작성
export async function postKidBoardingStatus(childId: number) {
  try {
    const response = await axiosInstance.post(`busstop/parent/${childId}`)

    if (response.data.status === 'success') {
      console.log(response.data.data) // 확인 후 삭제
      return response.data.data
    } else {
      throw new Error('Failed to fetch notices')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 학부모 버스 탑승 여부 조회
export async function getKidBoardingStatus() {
  try {
    const response = await axiosInstance.get(`busstop/child`)

    if (response.data.status === 'success') {
      console.log(response.data.data) // 확인 후 삭제
      return response.data.data
    } else {
      throw new Error('Failed to fetch notices')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

// 버스정류장 정보 가져오기
export async function getBusstop(kindergartenId: number) {
  console.log("유치원id :", kindergartenId)
  try {
    const response = await axiosInstance.get(`busstop/kindergarten/${kindergartenId}`)

    if (response.data.status === 'success') {
      // console.log(response.data.data)
      return response.data.data
    } else {
      throw new Error('Failed to get Busstop')
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

// 특정 버스정류장 PK로 정보 가져오기
export async function getOneBusstopInfo(busstopId: number):Promise<BusChildProps[]> {
  try {
    const response = await axiosInstance.get(`busstop/${busstopId}`)

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error("버스ID로 버스 정보를 가져올 수 없습니다.")
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}