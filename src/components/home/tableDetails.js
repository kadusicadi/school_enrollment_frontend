import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Url from "../../../constants";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocument from "../PDFcomponent/PDFdocument";

const TableDetails = ({ courseId }) => {
    const [isVisible, setIsVisible] = useState(true); // State to manage visibility
    const [showPDF, setShowPDF] = useState(false);
    const router = useRouter();
    const { data } = useSession();
    const [student, setStudent] = useState(null);
    const [averageScores, setAverageScores] = useState(null);
    const [specialScores, setSpecialScores] = useState(null);
    const [acknowledgmentPoints, setAcknowledgementPoints] = useState(null);
    const [sv, setSV] = useState(null);
    const [sv2, setSV2] = useState(null);
    const [sv3, setSV3] = useState(null);
    const [total, setTotal] = useState(null);

    // Function to fetch student data
    async function getStudent(courseId) {
        try {
            const resp = await fetch(`${Url}/api/sec-students/student-list/`, {
                method: 'GET',
            });
            const studentsData = await resp.json();
            const filteredStudents = studentsData.filter(student => {
                return student.desired_course_A.toUpperCase() === courseId.toUpperCase();
            });
            const studentIds = filteredStudents.map(student => student.id);
            setStudent(filteredStudents);
            return studentIds;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    // Function to fetch average scores for students
    async function getAverageScoresForStudents(studentIds) {
        try {
            for (const studentId of studentIds) {
                const resp = await fetch(`${Url}/api/sec-students/student/${studentId}/average/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': data ? `Bearer ${data.user.token}` : null
                    }
                });
                const scoresData = await resp.json();
                const averageScoresPerGrade = {
                    VI: scoresData.average_VI,
                    VII: scoresData.average_VII,
                    VIII: scoresData.average_VIII,
                    IX: scoresData.average_IX,
                };
                setAverageScores(prevState => ({
                    ...prevState,
                    [studentId]: averageScoresPerGrade
                }));
                setSV(prevState => ({
                    ...prevState,
                    [studentId]: scoresData.points
                }));
            }
        } catch (e) {
            console.log(e);
        }
    }

    // Function to fetch special scores for students
    async function getSpecialScoresForStudents(studentIds, courseId) {
        try {
            for (const studentId of studentIds) {
                const resp = await fetch(`${Url}/api/sec-students/student/${studentId}/special-courses/${courseId}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': data ? `Bearer ${data.user.token}` : null
                    }
                });
                const scoresData = await resp.json();
                const specialScoresData = scoresData.map(courseData => {
                    const { ...rest } = courseData;
                    return rest;
                });
                const totalPoints = specialScoresData.reduce((acc, courseData) => acc + courseData.total_special_points, 0);
                setSpecialScores(prevState => ({
                    ...prevState,
                    [studentId]: specialScoresData
                }));
                setSV2(prevState => ({
                    ...prevState,
                    [studentId]: totalPoints
                }));
            }
        } catch (e) {
            console.log(e);
        }
    }

    // Function to fetch acknowledgment points for students
    async function getAcknowledgmentPointsForStudents(studentIds) {
        try {
            for (const studentId of studentIds) {
                const resp = await fetch(`${Url}/api/sec-students/student/${studentId}/acknowledgmentsPoints/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': data ? `Bearer ${data.user.token}` : null
                    }
                });
                const acknowledgmentData = await resp.json();
                const acknowledgmentPointsPerLevel = {
                    O: acknowledgmentData.total_district_points,
                    K: acknowledgmentData.total_canton_points,
                    F: acknowledgmentData.total_federal_points,
                };
                setSV3(prevState => ({
                    ...prevState,
                    [studentId]: acknowledgmentData.total_ack_points
                }));
                setAcknowledgementPoints(prevState => ({
                    ...prevState,
                    [studentId]: acknowledgmentPointsPerLevel
                }));
            }
        } catch (e) {
            console.log(e);
        }
    }

    // Function to fetch total points for students
    async function getTotalPointsForStudents(studentIds, courseId) {
        try {
            for (const studentId of studentIds) {
                const resp = await fetch(`${Url}/api/sec-students/student/${studentId}/${courseId.toUpperCase()}/points-summary-per-course-code/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': data ? `Bearer ${data.user.token}` : null
                    }
                });
                const { total_points } = await resp.json();
                setTotal(prevState => ({
                    ...prevState,
                    [studentId]: total_points || 0
                }));
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const studentIds = await getStudent(courseId);
                await Promise.all([
                    getAverageScoresForStudents(studentIds),
                    getSpecialScoresForStudents(studentIds, courseId),
                    getAcknowledgmentPointsForStudents(studentIds),
                    getTotalPointsForStudents(studentIds, courseId),
                ]);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [courseId]);

    const sortedStudents = student ? [...student].sort((a, b) => {
        const totalA = total && total[a?.id] !== undefined ? total[a.id] : 0;
        const totalB = total && total[b?.id] !== undefined ? total[b.id] : 0;
        return totalB - totalA;
    }) : [];

    return (
        <div className="full-w overflow-x-auto">
            <button onClick={() => router.push(`/home/${courseId}`)} className="flex items-center px-2 py-1 rounded-md hover:bg-gray-300 focus:outline-none">
                <ChevronLeftIcon className="w-6 h-6 mr-1" />
            </button>
            {showPDF ? null : (
                <table className="min-w-full border border-gray-200 mt-2">
                    <thead className="bg-gray-50">
                        {isVisible && (
                            <>
                                <tr className="border-b border-gray-200">
                                    <th colSpan="3" scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Generalije</th>
                                    {averageScores && Object.keys(averageScores).length > 0 && (
                                        <>
                                            <th colSpan="5" scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">I-Opšti kriterij - USPJEH VI - IX O.Š. x3</th>
                                            <th colSpan="7" scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">II-Posebni kriterij - RELEVANTNI NASTAVNI PREDMETI</th>
                                            <th colSpan="4" scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">III-Specijalni kriterij - TAKMIČENJE VIII i IX RAZRED</th>
                                        </>
                                    )}
                                </tr>
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">RB</th>
                                    {['Ime i prezime', 'Osnovna škola', ...(averageScores ? Object.keys(averageScores[Object.keys(averageScores)[0]]) : []), 'SV (Opšti kriterij)', ...(specialScores && specialScores[Object.keys(specialScores)[0]] && specialScores[Object.keys(specialScores)[0]].length > 0 ? Object.keys(specialScores[Object.keys(specialScores)[0]][0]).filter(key => key !== 'course' && key !== 'total_special_points') : []), 'SV (posebni kriterij)', 'O', 'K', 'F', 'SV (specijalni kriterij)', 'Ukupno'].map(header => (
                                        <th key={header} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">{header}</th>
                                    ))}
                                </tr>
                            </>
                        )}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isVisible && sortedStudents.map((studentData, studentIndex) => (
                            <tr key={studentData.id}>
                                <td className="px-6 py-4 text-center whitespace-nowrap border-r border-gray-200">{studentIndex + 1}</td>
                                {[`${studentData?.name || ''} ${studentData?.last_name || ''}${studentData?.special_case !== 'regular' ? '*' : ''}`, studentData?.primary_school || '', ...(averageScores && averageScores[studentData.id] ? Object.values(averageScores[studentData.id]) : []), sv && sv[studentData.id] ? sv[studentData.id] : '', ...(specialScores && specialScores[studentData.id] && specialScores[studentData.id].length > 0 ? Object.values(specialScores[studentData.id][0]).filter((_, index) => index !== 0 && index !== Object.values(specialScores[studentData.id][0]).length - 1) : []), sv2 && sv2[studentData.id] ? sv2[studentData.id] : '', ...(acknowledgmentPoints && acknowledgmentPoints[studentData.id] ? Object.values(acknowledgmentPoints[studentData.id]) : []), sv3 && sv3[studentData.id] !== undefined ? sv3[studentData.id] : 0, total && total[studentData.id] ? total[studentData.id] : ''].map((value, index) => (
                                    <td key={index} className="px-6 py-4 text-center whitespace-nowrap border-r border-gray-200">{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
    
            {/* Render the button to toggle PDF view only for authenticated users */}
            {data && (
                <button onClick={() => setShowPDF(!showPDF)} className="flex items-center px-2 py-1 rounded-md hover:bg-gray-300 focus:outline-none">
                    {showPDF ? "Hide PDF" : "Show PDF"}
                </button>
            )}
    
            {/* Render PDF viewer only if showPDF is true and user is authenticated */}
            {showPDF && data && (
                <div>
                    {/* Download PDF button */}
                    <PDFDownloadLink document={<PDFDocument sortedStudents={sortedStudents} averageScores={averageScores} specialScores={specialScores} acknowledgmentPoints={acknowledgmentPoints} sv={sv} sv2={sv2} sv3={sv3} total={total} />} fileName="tabela_učenika.pdf">
                        {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download PDF')}
                    </PDFDownloadLink>
                    {/* PDF viewer */}
                    <PDFViewer style={{ width: "100%", height: "100%" }}>
                        <PDFDocument
                            sortedStudents={sortedStudents}
                            averageScores={averageScores}
                            specialScores={specialScores}
                            acknowledgmentPoints={acknowledgmentPoints}
                            sv={sv}
                            sv2={sv2}
                            sv3={sv3}
                            total={total}
                        />
                    </PDFViewer>
                </div>
            )}
        </div>
    );
    
}

export default TableDetails;
