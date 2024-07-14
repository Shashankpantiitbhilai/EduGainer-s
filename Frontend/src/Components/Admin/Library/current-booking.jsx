import React, { useState } from "react";
import LegendsFunctions from "./legend";
import StudentManagementTable from "./table";

const AdminPanel = () => {
  const [legends, setLegends] = useState([]);

  return (
    <div style={{ display: "flex" }}>
      <StudentManagementTable legends={legends} setLegends={setLegends} />
    </div>
  );
};

export default AdminPanel;
