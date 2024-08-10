import daramgisad from '../../assets/common/daramgisad.png'
import TeacherHeader from '../../components/teacher/common/TeacherHeader'

export default function TeacherErrorPage() {
    return(
        <>
            <TeacherHeader />
            <div>
                <img src={daramgisad} alt="daramgisad" />
            </div>
        </>
    )
}