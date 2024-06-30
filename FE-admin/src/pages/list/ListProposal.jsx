import "./listproposal.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DataPropose from "../../components/datatable/DataProposal";

const ListProposal = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <DataPropose />
      </div>
    </div>
  );
};

export default ListProposal;
