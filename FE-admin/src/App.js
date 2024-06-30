import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import ListProgram from "./pages/list/ListProgram";
import ListProposal from "./pages/list/ListProposal";
import ListJoinProgram from "./pages/list/ListJoinProgram";
import ListAttendance from "./pages/list/ListAttendance";
import CreateNotification from "./pages/new/NewNotice";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { programInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import ListUser from "./pages/list/listUser";
import RegisterUser from "./pages/new/Register-user";
import CreateProgram from "./pages/new/create-program";
import ProgramDetail from "./pages/single/program-detail";
import UpdateProgram from "./pages/update/UpdateProgram";
import UpdateUser from "./pages/update/UpdateUser";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/users">
            <Route index element={<ListUser />} />
            <Route path=":userId" element={<ProgramDetail />} />
            <Route
              path="register-user"
              element={<RegisterUser inputs={userInputs} title="Thêm sinh viên" />}
            />
            <Route
              path="update-user/:userId"
              element={<UpdateUser inputs={userInputs} title="Cập nhật sinh viên" />}
            />
          </Route>
          <Route path="/programs">
            <Route index element={<ListProgram />} />
            <Route path=":programId" element={<ProgramDetail />} />
            <Route path="create-program" element={<CreateProgram inputs={programInputs} title="Thêm chương trình" />} />
            <Route path="update-program/:programId" element={<UpdateProgram inputs={programInputs} title="Cập nhật chương trình" />} />
            <Route path="joinprogram/:programId" element={<ListAttendance />} /> 
          </Route>
          <Route path="/notice">
            <Route index element={<CreateNotification />} />
          </Route>
          <Route path="/proposals">
            <Route index element={<ListProposal />} />
          </Route>
          <Route path="/attendances">
            <Route index element={<ListJoinProgram />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
