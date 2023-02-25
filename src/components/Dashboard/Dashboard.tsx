import { useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button } from "antd";

import useConnect from "./dashboard-controller";

function Dashboard() {
  const {
    gridRef,
    containerStyle,
    gridStyle,
    rowData,
    gridConfig,
    //getGridData,
    logout,
  } = useConnect();

  // useEffect(() => {
  //   getGridData();
  // }, []);

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  return (
    <>
      <div className="topnav-right">
        <Button onClick={() => logout()}>Logout</Button>
      </div>
      <br />
      <div style={containerStyle} className="grid">
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            gridOptions={gridConfig}
            rowData={rowData}
            paginationAutoPageSize={true}
            pagination={true}
            ref={gridRef}
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
