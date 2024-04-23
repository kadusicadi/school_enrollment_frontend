import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Url from "../../../constants";
import Link from "next/link";

const ListStudents = () => {
    const { data } = useSession();
    const [studentsData, setStudentsData] = useState(null);
    const [nameInput, setNameInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getStudentPoints = async (name) => {
        try {
            setLoading(true);
            const resp = await fetch(`${Url}api/sec-students/student/points-summary/${name}/`, {
                method: 'GET',
                headers: {
                    'Authorization': data ? `Bearer ${data.user.token}` : null
                }
            });
            if (resp.status === 404) {
                setStudentsData(null);
                setError('Učenik nije upisan!');
            } else {
                const studentsData = await resp.json();
                setStudentsData(studentsData);
                setError('');
            }
        } catch (e) {
            console.log(e);
            setError('Dogodila se greška prilikom dohvaćanja podataka.');
        } finally {
            setLoading(false);
        }
    }

    const handleInputChange = (event) => {
        setNameInput(event.target.value);
    };

    const handleShowPoints = () => {
        if (nameInput.trim() !== '') {
            getStudentPoints(nameInput);
        }
    };

    return (
        <div>
            <div className="flex justify-center" style={{ paddingBottom: '40px' }}>
                <h1 className="text-4xl font-semibold text-center">Dobrodošli</h1>
            </div>
            <div className="flex flex-col">
                <div className="mb-4">
                    <label htmlFor="courseInput" className="block text-sm font-bold mb-2 ml-3">Unesite ime i prezime učenika:</label>
                    <div className="flex">
                        <input
                            id="nameInput"
                            type="text"
                            className="border rounded w-full py-2 px-3"
                            value={nameInput}
                            onChange={handleInputChange}
                            placeholder="Unesi ime i prezime"
                        />
                        <button className="ml-1 text-sm text-black bg-gray-300 px-4 py-2 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg" onClick={handleShowPoints} disabled={loading}>
                            Prikaži
                        </button>
                    </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        {error && <p className="text-red-500">{error}</p>}
                        {studentsData && (
                            <>
                                {studentsData
                                    .sort((a, b) => (a.course === a.desired_course_A ? -1 : b.course === b.desired_course_A ? 1 : 0))
                                    .map((course, index) => (
                                        <div key={index} className={`rounded-md p-4 my-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6 ${course.course === course.desired_course_A ? 'bg-blue-300' : 'bg-gray-100'}`}>
                                            <dt className="text-base">Smjer: {course.course}</dt>
                                            <dd className="text-base">Bodovi: {course.total_points}</dd>
                                            <Link href={`/home/${course.course}/${course.id}`} passHref>
                                                <button className="text-sm text-black bg-gray-300 px-4 py-2 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg">
                                                    Detalji
                                                </button>
                                            </Link>
                                        </div>
                                    ))}
                            </>
                        )}
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default ListStudents;
