import { useRouter } from "next/router";

import { toast } from 'react-toastify';
import Layout from '../src/components/layout/Layout';
import ListStudents from "../src/components/home/listStudentsHome";
import ListCoursesHome from "../src/components/home/listCoursesHome";
import SidebarHome from "../src/components/home/sidebarHome";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect, useState, useContext } from "react";

const Home = (props) => {
  const [selectedPage, setSelectedPage] = useState("listStudentsHome")

  useEffect(() => {
    const a = 2
    const b = 3
    const c = 4
    if (a===2 && (b===2 || c===4)) {
      console.log('true')
    } else {
      console.log('false')

    }
  })
  return (
    <Layout>
      <div className="flex mt-6 gap-5">
        <div className="w-1/5 border-r">
        <SidebarHome
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
        </div>
        <div className="w-4/5">
          {selectedPage === "listStudentsHome" && <ListStudents />}
          {selectedPage === "listCoursesHome" && <ListCoursesHome setSelectedPage={setSelectedPage} />}
        </div>
      </div>




    </Layout>
  )
};

export default Home;
