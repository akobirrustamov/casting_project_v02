import React, { useState, useEffect } from 'react';
import ApiCall from "../../config";
import Sidebar from "./Sidebar";
import 'rodal/lib/rodal.css';
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";

const AdminHome = () => {
    const navigate = useNavigate();



    return (
        <div>
            <Header props='admin' />

            <div >
              <h1>Bosh sahifa</h1>
            </div>
        </div>
    );
};

export default AdminHome;
