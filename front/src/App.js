import React, { useEffect } from "react";
import './App.css';
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ApiCall from "./config/index"

// my pages
import Home from "./pages/home/Home"
import PageNotFound from "./pages/404/404";
import AdminHome from "./admin/admin/AdminHome";
import AdminNews from "./admin/admin/AdminNews";
import DataForm from "./pages/dataForm/DataForm";
import History from "./pages/history/History";
import Appeal from "./pages/appeal/Appeal";



function App() {

  const blockedPages = [
    "/dashboard"
  ];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    checkSecurity()
  }, [blockedPages, location.pathname, navigate])
  async function checkSecurity() {
    if (blockedPages.some((blockedPage) => location.pathname.startsWith(blockedPage))) {
      let accessToken = localStorage.getItem("access_token");
      const res = await ApiCall("/api/v1/security", "GET")
      if (res?.data == 401) {
        navigate("/admin/login");
      }
      if (accessToken !== null) {
        if (res?.data !== 401 && res?.error) {
          if (res?.data[0]?.name !== "ROLE_ADMIN") {
            navigate("/404")
          }
        }
      } else {
        navigate("/admin/login");
      }
    }
  }

  return (
    <div>
      <Routes>
        {/*  app admin */}
        <Route path={"/admin"} element={<AdminHome />} />
        <Route path={"/admin/news"} element={<AdminNews />} />
        <Route path={"/admin/casting-users"} element={<AdminHome />} />
        <Route path={"/admin/casting-users/:userId"} element={<AdminHome />} />
        <Route path={"/*"} element={<PageNotFound />} />




        {/*  app user */}
        <Route path={"/:userId"} element={<Home />} />
        <Route path={"/"} element={<Home />} />
        <Route path={"/data-form/:userId"} element={<DataForm />} />
        <Route path={"/history/:userId"} element={<History />} />
        <Route path={"/appeal/:appealId"} element={<Appeal />} />






      </Routes>
    </div>
  );
}

export default App;
