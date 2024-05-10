import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Url from "../../../constants";
import ConfirmationModal from "../delete/confirmationModal";
import Link from "next/link";

const ListStudents = () => {
    const { status, data } = useSession();
    const [students, setStudents] = useState([])
    const [courses, setCourses] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");

    async function getCourses(dataInfo) {
      try {
          const resp = await fetch(`${Url}api/sec-schools/school-list/1/courses/`, {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${dataInfo.user.token}`
              }
          });
          const coursesData = await resp.json();
          setCourses(coursesData)
      } catch (e) {
          console.log(e);
      }
  }

    async function getStudents(dataInfo) {
      try {
          const resp = await fetch(`${Url}api/sec-students/student-list/`, {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${dataInfo.user.token}`
              }
          });
          const studentsData = await resp.json();
          studentsData.sort((a, b) => a.name.localeCompare(b.name));
          setStudents(studentsData);
      } catch (e) {
          console.log(e);
      }
  }

    // Function for deleting students;
    async function deleteStudent(id) {
    try {
      const resp = await fetch(`${Url}/api/sec-students/student-list/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data.user.token}`,
        },
      });
      if (resp.ok) {
        setStudents(students.filter((student) => student.id !== id));
      } else {
        console.error("Failed to delete student!");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  }

    useEffect(() => {
        if (data) {
            getCourses(data);
            getStudents(data)
        }
    }, [data])

    // It lists the students based on the teachers course;
  /*const filteredStudents = students.filter(
    (i) => i.desired_course_A == data.user.course_code
  );*/

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };


    const filteredStudents = students.filter(student => {
      const fullName = `${student.last_name} ${student.name}`.toLowerCase();
      const reversedFullName = `${student.name} ${student.last_name}`.toLowerCase();
      const searchQuery = searchInput.toLowerCase();

      if (fullName.includes(searchQuery) || reversedFullName.includes(searchQuery)) {
          return true;
      }

      const lastNameMatch = student.last_name.toLowerCase().includes(searchQuery);
      const firstNameMatch = student.name.toLowerCase().includes(searchQuery);
      return lastNameMatch || firstNameMatch;
  }).filter(student => {
      if (selectedCourse !== "") {
        return student.desired_course_A === selectedCourse;
      } else {
        return true;
      }
  });

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <div>
        <div className="flex flex-col">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold mb-3">Lista učenika</h1>
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Pretraži ime i prezime"
                        className="ml-3 px-3 py-1 border border-gray-300 rounded-md focus:outline-none"
                        value={searchInput}
                        onChange={handleSearchInputChange}
                    />
                    <select
                        className="ml-3 px-3 py-1 border border-gray-300 rounded-md focus:outline-none"
                        value={selectedCourse}
                        onChange={handleCourseChange}
                    >
                        <option value="">Svi smjerovi</option>
                        {courses.map(course => (
                            <option key={course._course_code} value={course._course_code}>{course._course_code}</option>
                        ))}
                    </select>
                </div>
            </div>
            {filteredStudents.length > 0 ? (
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="mt-3 mb-3 flex">
                        <dt className="text-gray-700 ml-5 font-bold min-w-[12rem]">Ime i prezime</dt>
                        <dt className="text-gray-700 font-bold min-w-[7.5rem]">Email</dt>
                        <dt className="text-gray-700 font-bold min-w-[11rem]">Smjer</dt>
                        <dt className="text-gray-700 font-bold">Telefon</dt>
                    </div>
                        {filteredStudents.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className="py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:py-5 sm:px-6"
                                >
                                    <dt className="text-sm font-medium text-gray-500 first-letter:capitalize">
                                        {index + 1}. {item.name} {item.last_name}
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">
                                        {item.email}
                                    </dd>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">
                                        {item.desired_course_A}
                                    </dd>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">
                                        {item.guardian_number}
                                    </dd>
                                    {/* Instead of a button we are using a link */}
                                    <Link href={`/user/pupils/${item.id}/edit`} passHref>
                                        <div
                                            className="mt-1 text-sm text-black bg-gray-300 sm:col-span-1 px-4 py-2 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg ml-2"
                                            style={{
                                                alignSelf: "center",
                                                width: "100px",
                                                marginLeft: "60px",
                                            }}
                                        >
                                            Uredi
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setStudentToDelete(item);
                                            setShowDeleteModal(true);
                                        }}
                                        className="mt-1 text-sm text-white bg-red-500 sm:col-span-1 px-4 py-2 hover:bg-red-600 rounded-md shadow-lg ml-4"
                                        style={{ alignSelf: "center", width: "100px" }}
                                    >
                                        Izbriši
                                    </button>
                                </div>
                            );
                        })}
                    </dl>
                </div>
            ) : (
              <div className="text-center font-bold text-red-500 mt-4">
                  {selectedCourse === "" ? "Birani učenik nije upisan!" : searchInput.trim() === "" ? "Nema upisanih učenika na ovom smjeru!" : "Birani učenik nije upisan na ovaj smjer."}
              </div>
            )}
        </div>
        {/* Render the delete modal */}
        {showDeleteModal && (
            <ConfirmationModal
                message="Da li ste sigurni da želite izbrisati ovog učenika?"
                onConfirm={() => {
                    deleteStudent(studentToDelete.id);
                    setShowDeleteModal(false);
                }}
                onCancel={() => setShowDeleteModal(false)}
            />
        )}
    </div>
);

};

export default ListStudents;