import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Url from "../../../constants";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocument from "../PDFcomponent/PDFdocument";

const TableDetails = ({ courseId }) => {
    const router = useRouter();
    const { data } = useSession();
    const [students, setStudents] = useState([]);
    const [isVisible, setIsVisible] = useState(true); // State to manage visibility
    const [showPDF, setShowPDF] = useState(false);
    const [student, setStudent] = useState(null);
    const [averageScores, setAverageScores] = useState(null);
    const [specialScores, setSpecialScores] = useState(null);
    const [acknowledgmentPoints, setAcknowledgementPoints] = useState(null);
    const [sv, setSV] = useState(null);
    const [sv2, setSV2] = useState(null);
    const [sv3, setSV3] = useState(null);
    const [total, setTotal] = useState(null);

    useEffect(() => {
        const queryStudents = router.query.students;
        console.log('Query Students:', queryStudents); // Log the value to check
    
        if (queryStudents) {
            try {
                const parsedStudents = JSON.parse(decodeURIComponent(queryStudents));
                setStudents(parsedStudents);
                const avgVI = parsedStudents.map(student => student.average_VI);
                const avgVII = parsedStudents.map(student => student.average_VII);
                const avgVIII = parsedStudents.map(student => student.average_VIII);
                const avgIX = parsedStudents.map(student => student.average_IX);

            // Set the average scores state
                setAverageScores({ VI: avgVI, VII: avgVII, VIII: avgVIII, IX: avgIX });
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
    }, [router.query.students]);

    const sortedStudents = student ? [...student].sort((a, b) => {
        const totalA = total && total[a?.id] !== undefined ? total[a.id] : 0;
        const totalB = total && total[b?.id] !== undefined ? total[b.id] : 0;
        return totalB - totalA;
    }) : [];


    console.log(averageScores)
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
                        {isVisible && students.map((studentData, studentIndex) => (
                            <tr key={studentData.id}>
                                <td className="px-6 py-4 text-center whitespace-nowrap border-r border-gray-200">{studentIndex + 1}</td>
                                {[`${studentData?.name || ''} ${studentData?.last_name || ''}${studentData?.special_case !== 'regular' ? '*' : ''}`, studentData?.primary_school || '', ...(averageScores && averageScores[studentData[1]] ? Object.values(averageScores[studentData.id]) : []), sv && sv[studentData.id] ? sv[studentData.id] : '', ...(specialScores && specialScores[studentData.id] && specialScores[studentData.id].length > 0 ? Object.values(specialScores[studentData.id][0]).filter((_, index) => index !== 0 && index !== Object.values(specialScores[studentData.id][0]).length - 1) : []), sv2 && sv2[studentData.id] ? sv2[studentData.id] : '', ...(acknowledgmentPoints && acknowledgmentPoints[studentData.id] ? Object.values(acknowledgmentPoints[studentData.id]) : []), sv3 && sv3[studentData.id] !== undefined ? sv3[studentData.id] : 0, total && total[studentData.id] ? total[studentData.id] : ''].map((value, index) => (
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

