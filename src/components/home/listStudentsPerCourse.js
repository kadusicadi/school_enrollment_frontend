import { useEffect, useState } from "react";
import Url from "../../../constants";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const ListStudentsPerCourse = ({ courseId }) => {
    const router = useRouter();
    const [students, setStudents] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    async function getStudents(courseId) {
        try {
            const studentsData = await getAllStudents(courseId);
            setStudents(studentsData);
        } catch (e) {
            console.error("Error fetching student data:", e);
        }
    }

    useEffect(() => {
        getStudents(courseId);
    }, [courseId]);

    // Using this function we can navigate back to the start screen
    const back = () => {
        router.push('/');
    };

    // Function to handle search input change
    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    // Filter students based on search input
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchInput.toLowerCase())
    );

    console.log(filteredStudents[0])

    return (
        <div>
            <div className="flex flex-col">
                <div className="flex items-center justify-between">
                    <h1 className="ml-3 text-2xl font-semibold">Lista učenika {courseId}</h1>
                    <div className="flex items-center pb-2">
                        <Link href={`/home/${courseId}/table`} passHref>
                            <div className="mr-2 text-sm text-black bg-gray-300 sm:col-span-1 px-4 py-2 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg table-btn">
                                Tabelarni prikaz
                            </div>
                        </Link>
                        <input
                            type="text"
                            placeholder="Pretraga"
                            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none"
                            value={searchInput}
                            onChange={handleSearchInputChange}
                        />
                        <button className="ml-3 mb-2 flex items-center px-2 py-1 boarder none" onClick={back}>
                            <ChevronLeftIcon className="w-6 h-6 mr-1" />
                        </button>
                    </div>
                </div>
                {filteredStudents.length > 0 && (
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            {filteredStudents.map((item, index) => (
                                <div key={index} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 first-letter:capitalize">{index + 1}. {item.name} {item.last_name}</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Bodovi: {item.totalPoints}</dd>
                                    <Link
                                    href={`/home/${courseId}/${item.id}`}
                                    passHref>
                                        Detalji
                                </Link>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}
            </div>
        </div>
    );
};

// Function to retrieve all students
export const getAllStudents = async (courseId) => {
    try {
        const resp = await fetch(`${Url}api/sec-students/student-list/1/${courseId}/1/10/`, {
            method: 'GET',
        });
        const studentsData = await resp.json();

        return Object.values(studentsData).map(studentArray => {
            const [
                courseName,
                id,
                name,
                lastName,
                middleName,
                primary_school,
                status,
                courseCode,
                totalPoints,
                [
                    { average_VI, average_VII, average_VIII, average_IX, points },
                    { total_special_points },
                    { acknowledgments: { total_federal_points, total_canton_points, total_district_points, total_ack_points } },
                    //{ sc_per_grade }
                ]
            ] = studentArray;
        
            return {
                id,
                name,
                last_name: lastName,
                primary_school,
                totalPoints,
                average_VI,
                average_VII,
                average_VIII,
                average_IX,
                points,
                total_special_points,
                total_federal_points,
                total_canton_points,
                total_district_points,
                total_ack_points,
                //sc_per_grade
            };
        });
    } catch (e) {
        console.error("Error fetching student data:", e);
        return [];
    }
};

export default ListStudentsPerCourse;
