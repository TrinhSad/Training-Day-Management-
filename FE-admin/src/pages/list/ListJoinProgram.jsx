import "./listjoinprogram.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DataJoinProgram from "../../components/datatable/DataJoinProgram";

const ListJoinProgram = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <DataJoinProgram />
      </div>
    </div>
  );
};

export default ListJoinProgram;
