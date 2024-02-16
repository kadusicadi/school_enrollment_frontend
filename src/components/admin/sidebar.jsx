const Sidebar = ({selectedPage, setSelectedPage}) => {
    return (
        <div>
            <div className="flex flex-col">
            <div className="bg-gray-700 text-white py-2 px-4 uppercase border-b text-center font-bold">
                    Nastavnici
                </div>
                <div
                    onClick={() => setSelectedPage("listTeachers")}
                    className={`cursor-pointer border-b hover:bg-gray-100 py-2 px-5 first-letter:capitalize ${selectedPage === 'listTeachers' ? 'border-r-4 border-r-green-500' : ''}`}>
                    <span>Lista nastavnika</span>
                </div>
                <div
                    onClick={() => setSelectedPage("newTeacher")}
                    className={`cursor-pointer border-b hover:bg-gray-100 py-2 px-5 first-letter:capitalize ${selectedPage === 'newTeacher' ? 'border-r-4 border-r-green-500' : ''}`}>
                    <div>Registruj novog nastavnika</div>
                </div>
                {/* New section for "kursevi" */}
                <div className="bg-gray-700 text-white py-2 px-4 uppercase border-b text-center font-bold">
                    Smjerovi
                </div>
                <div
                    onClick={() => setSelectedPage("listCourses")}
                    className={`cursor-pointer border-b hover:bg-gray-100 py-2 px-5 first-letter:capitalize ${selectedPage === 'listCourses' ? 'border-r-4 border-r-green-500' : ''}`}>
                    <span>Lista smjerova</span>
                </div>
                <div
                    onClick={() => setSelectedPage("newCourse")}
                    className={`cursor-pointer border-b hover:bg-gray-100 py-2 px-5 first-letter:capitalize ${selectedPage === 'newCourse' ? 'border-r-4 border-r-green-500' : ''}`}>
                    <div>Dodaj novi smjer</div>
                </div>
            </div>
        </div>
    )
};

export default Sidebar;