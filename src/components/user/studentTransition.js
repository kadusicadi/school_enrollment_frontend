import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Url from "../../../constants";

const StudentTransition = ({ studentId }) => {
    const { data } = useSession();
    const router = useRouter();
    const [student, setStudent] = useState(null);
    const [oldCourse, setOldCourse] = useState('');
    const [newCourse, setNewCourse] = useState('');
    const [transitions, setTransitions] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchStudentData();
    }, [studentId]);

    async function fetchStudentData() {
        try {
            const studentResp = await fetch(`${Url}api/sec-students/student-list/${studentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${data.user.token}`,
                }
            });
            const studentData = await studentResp.json();
            setStudent(studentData);

            const transitionResp = await fetch(`${Url}api/sec-students/student-list/1/student/${studentId}/transition`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${data.user.token}`,
                }
            });
            const transitionData = await transitionResp.json();
            setTransitions(transitionData);

            if (!transitionData || transitionData.length === 0) {
                // If we do not have the transtion data just use desired_course_A;
                setOldCourse(studentData.desired_course_A);
            } else {
                // If there are transitions we use the latest new course for old course in the PUT;
                const latestTransition = transitionData[transitionData.length - 1];
                setOldCourse(latestTransition.new_course);
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const resp = await fetch(`${Url}api/sec-students/student-list/1/student/${studentId}/transition`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${data.user.token}`,
                },
                body: JSON.stringify({
                    pupil_id: studentId,
                    school_id: student.secondary_school_id,
                    old_course: oldCourse,
                    new_course: newCourse
                })
            });
            if (resp.ok) {
                console.log('Tranzicija izvršena');
                fetchStudentData();
                setShowForm(false);
            } else {
                console.error('Failed to save transition');
            }
        } catch (error) {
            console.error('Error saving transition:', error);
        }
    }

    return (
        <>
            {/* Table */}
            {!showForm && (
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left font-bold text-gray-800">Stari smjer</th>
                                <th className="px-4 py-2 text-left font-bold text-gray-800">Novi smjer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transitions.length > 0 ? (
                                transitions.map((transition, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{transition.old_course}</td>
                                        <td className="border px-4 py-2">{transition.new_course}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="border px-4 py-2 text-center">Nema izvršene tranzicije!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
    
            {/* Button to toggle form */}
            {!showForm && (
                <div className="flex justify-center">
                    <button onClick={() => setShowForm(true)} className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 transition-colors shadow-lg mt-4">
                        Nova tranzicija
                    </button>
                </div>
            )}
    
            {/* Form */}
            {showForm && (
                <div className="flex justify-center items-start h-screen bg-gray-200 bg-opacity-75">
                    <div className="bg-white p-8 rounded-lg shadow-lg mt-20">
                        <h1 className="text-4xl font-bold mb-8 text-center text-gray-700">Nova tranzicija</h1>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="oldCourse" className="mb-1 font-bold text-gray-800">Stari smjer:</label>
                                <input
                                    type="text"
                                    id="oldCourse"
                                    value={oldCourse}
                                    onChange={(e) => setOldCourse(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="newCourse" className="mb-1 font-bold text-gray-800">Novi smjer:</label>
                                <input
                                    type="text"
                                    id="newCourse"
                                    value={newCourse}
                                    onChange={(e) => setNewCourse(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                                />
                            </div>
                            <div className="flex justify-between">
                                <button type="submit" className="w-1/2 bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 transition-colors shadow-lg mr-2">Submit</button>
                                <button type="button" onClick={() => setShowForm(false)} className="w-1/2 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition-colors shadow-lg ml-2">Otkaži</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default StudentTransition;
