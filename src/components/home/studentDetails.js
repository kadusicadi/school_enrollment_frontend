import React, { useEffect, useState } from 'react';
import { getAllStudents } from './listStudentsPerCourse';
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

const StudentDetails = ({ courseId, studentId }) => {
    const [student, setStudent] = useState(null);
    const [averageScores, setAverageScores] = useState(null);
    const [acknowledgmentPoints, setAcknowledgmentPoints] = useState(null);
    const [total, setTotal] = useState(null);
    const [sv, setSV] = useState(null);
    const [sv2, setSV2] = useState(null);
    const [sv3, setSV3] = useState(null);
    const [specialScores, setSpecialScores] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const studentsData = await getAllStudents(courseId);

                if (studentsData && studentsData.length > 0) {
                    // Filter the student data based on studentId
                    console.log('Student ID:', studentId);
                    console.log('Students Data:', studentsData);
                    const filteredStudent = studentsData.find(student => student.id === parseInt(studentId));

                    if (filteredStudent) {
                        // Set student state
                        setStudent(filteredStudent);

                        // Set acknowledgment points state
                        setAcknowledgmentPoints({
                            F: filteredStudent.total_federal_points,
                            K: filteredStudent.total_canton_points,
                            O: filteredStudent.total_district_points
                        });

                        // Set total points state
                        setTotal(filteredStudent.totalPoints);

                        // Set SV state
                        setSV(filteredStudent.points);

                        // Set SV2 state
                        setSV2(filteredStudent.total_special_points);

                        // Set SV3 state
                        setSV3(filteredStudent.total_ack_points);

                        // Set average scores state
                        setAverageScores({
                            VI: filteredStudent.average_VI,
                            VII: filteredStudent.average_VII,
                            VIII: filteredStudent.average_VIII,
                            IX: filteredStudent.average_IX
                        });

                        // Set special scores state
                        setSpecialScores(filteredStudent.specialScores); // Assuming you have a field named specialScores in your student object
                    } else {
                        console.error(`Student with ID ${studentId} not found.`);
                    }
                } else {
                    console.error('No student data available.');
                }
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, [courseId, studentId]);

    return (
        <div className="full-w overflow-x-auto">
            <button onClick={() => router.push(`/home/${courseId}`)} className="flex items-center px-2 py-1 rounded-md hover:bg-gray-300 focus:outline-none">
                <ChevronLeftIcon className="w-6 h-6 mr-1" />
            </button>
            <table className="min-w-full border border-gray-200 mt-2">
                <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                        <th colSpan="2" scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Generalije</th>
                        {averageScores && Object.keys(averageScores).length > 0 && (
                            <>
                                <th colSpan={Object.keys(averageScores).length + 1} scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">I-Opšti kriterij - USPJEH VI - IX O.Š. x3</th>
                                <th colSpan="7" scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">II-Posebni kriterij - RELEVANTNI NASTAVNI PREDMETI</th>
                                <th colSpan="4" scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">III-Specijalni kriterij - TAKMIČENJE VIII i IX RAZRED</th>
                            </>
                        )}
                    </tr>
                    <tr>
                        {['Ime i prezime', 'Osnovna škola', ...Object.keys(averageScores || {}), 'SV (Opšti kriterij)', ...specialScores?.length > 0 ? Object.keys(specialScores[0]).filter(key => key !== 'course' && key !== 'total_special_points').map(key => `${key}`) : [], 'SV (posebni kriterij)', 'O', 'K', 'F', 'SV (specijalni kriterij)', 'Ukupno'].map(header => (
                            <th key={header} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        {[`${student?.name} ${student?.last_name}`, student?.primary_school, ...(Object.values(averageScores || {})), sv, ...specialScores?.length > 0 ? Object.values(specialScores[0]).filter((_, index) => index !== 0 && index !== Object.values(specialScores[0]).length - 1) : [], sv2, ...(Object.values(acknowledgmentPoints || {})), sv3, total].map((value, index) => (
                            <td key={index} className="px-6 py-4 text-center whitespace-nowrap border-r border-gray-200">{value}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default StudentDetails;
