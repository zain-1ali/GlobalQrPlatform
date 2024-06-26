import Sidebar from "../components/Sidebar";
import { RiBarChartFill } from "react-icons/ri";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdArrowDropDown, MdOutlineAutoGraph } from "react-icons/md";
import { IoIosArrowDown, IoIosPause } from "react-icons/io";
import { IoDownload } from "react-icons/io5";
import { IoIosQrScanner } from "react-icons/io";
import { useNavigate } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import axios from "axios";
// import { LineChart } from "@mui/x-charts/LineChart";
import { Menu, MenuItem } from "@mui/material";

import { Line } from "react-chartjs-2";
import "chart.js/auto";
import dayjs from "dayjs";

interface qrType {
  name: string;
  url: string;
  forColor: string;
  bgColor: string;
  eyeColor: string;
  logo: string;
  bodyShape: "squares" | "dots" | undefined;
  eyeShape: string;
  frameShape: string;
  status: boolean;
  totalScans: string;
  userId: string;
  _id: string;
}

const getLastDates = (numDays: number): string[] => {
  return Array.from({ length: numDays }, (_, i) =>
    dayjs()
      .subtract(numDays - (i + 1), "day")
      .format("MMM D")
  );
};

const getWeekDates = (): string[] => {
  return Array.from({ length: 7 }, (_, i) =>
    dayjs()
      .subtract(7 - (i + 1), "day")
      .format("MMM D")
  );
};

const Analytics = () => {
  const navigate = useNavigate();
  const [scanAnalytics, setScanAnalytics] = useState<number[]>([]);
  const [analytics, setAnalytics] = useState<{
    _id: string;
    totalQrs: number;
    activeQrs: number;
    inactiveQrs: number;
    totalQrDownload: number;
    totalQrScan: number;
    totalQrDownloadCrntMonth: number;
    updatedMonth: number;
    userId: string;
    __v: number;
  }>({
    _id: "",
    totalQrs: 0,
    activeQrs: 0,
    inactiveQrs: 0,
    totalQrDownload: 0,
    totalQrScan: 0,
    totalQrDownloadCrntMonth: 0,
    updatedMonth: 0,
    userId: "",
    __v: 0,
  });

  const [qrs, setQrs] = useState<qrType[]>([]);

  const [analyticstype, setanalyticstype] = useState<string>("All");
  const [qrName, setQrName] = useState<string>("All");
  const getQrInfo = (name: string, id: string) => {
    setanalyticstype(id);
    setQrName(name);
  };

  const token = localStorage.getItem("gbQrId");
  let baseUrl = import.meta.env.VITE_BASE_URL;

  const [anchorEl3, setAnchorEl3] = useState<null | HTMLElement>(null);
  const open3 = Boolean(anchorEl3);

  const handleClickListItem3 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl3(event.currentTarget);
  };
  const handleClose3 = () => {
    setAnchorEl3(null);
  };

  // ---------------------------------------------get api call-------------------------------------

  const getAnalyticsData = async (id: string | null) => {
    try {
      const response = await axios.post(
        `${baseUrl}/analytics/get`,
        { qrId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAnalytics(response.data?.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // ---------------------------------------------get qrs api call-------------------------------------

  const getAllQrs = async () => {
    try {
      const response = await axios.get(`${baseUrl}/qr/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQrs(response.data?.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // ---------------------------------------------get scan analytics api call-------------------------------------
  const [statValue, setStatValue] = useState<string>("weakly");
  const getScanAnalyticsData = async (
    type: string,
    analyticstype: string | null | undefined
  ) => {
    try {
      const response = await axios.post(
        `${baseUrl}/analytics/scans`,
        { type, qrId: analyticstype },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setScanAnalytics(response?.data?.data);
      // setStatValue("");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getAllQrs();

    if (analyticstype === "All") {
      getAnalyticsData(null);
    } else {
      console.log("id");
      getAnalyticsData(analyticstype);
    }
  }, [analyticstype]);

  console.log(scanAnalytics);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  console.log(statValue);
  const open = Boolean(anchorEl);

  const handleClickListItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGetValue = (value: string) => {
    setStatValue("");
    if (value === "monthly") {
      setStatValue("monthly");
    } else if (value === "weakly") {
      setStatValue("weakly");
    } else if (value === "yearly") {
      setStatValue("yearly");
    }

    handleClose();
  };

  useEffect(() => {
    if (analyticstype === "All") {
      console.log("all");
      getScanAnalyticsData(statValue, null);
    } else {
      console.log("id");
      getScanAnalyticsData(statValue, analyticstype);
    }
  }, [statValue, analyticstype]);

  const monthLabels = getLastDates(30);
  const weekLabels = getWeekDates();

  const monthChartData = {
    labels: [
      monthLabels[0],
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      monthLabels[10],
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      monthLabels[20],
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      monthLabels[29],
    ],
    datasets: [
      {
        label: "Monthly Data",
        data: scanAnalytics,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const weekChartData = {
    labels: weekLabels,
    datasets: [
      {
        label: "Weekly Data",
        data: scanAnalytics,
        fill: false,
        backgroundColor: "rgba(153,102,255,0.2)",
        borderColor: "rgba(153,102,255,1)",
      },
    ],
  };

  const yearChartData = {
    labels: ["Jan", "", "", "Apr", "", "", "", "Jul", "", "", "", "", "Dec"],
    datasets: [
      {
        label: "Yearly Data",
        data: scanAnalytics,
        fill: false,
        backgroundColor: "rgba(255,159,64,0.2)",
        borderColor: "rgba(255,159,64,1)",
      },
    ],
  };

  return (
    <div className="w-[100%] h-[100vh] flex justify-between">
      <Sidebar />
      <div className="h-[100%] w-[78%] flex justify-center items-center">
        <div className="h-[95%] w-[95%]  flex flex-col justify-between">
          <div className="w-[100%] flex justify-between items-center h-[11%]">
            <div className="flex items-center gap-2">
              <RiBarChartFill className="text-[34px] text-[#FE5B24]" />
              <p className="font-[600] text-[24px] text-[#FE5B24]">Analytics</p>
            </div>
            <div className="flex justify-between w-[40%]">
              {/* <div
                className="w-[185px] h-[53px] rounded-[12px] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
               
              >
                <select
                  className="w-[90%] h-[95%] outline-none text-[#FE5B24]"
                  onChange={(e) => setanalyticstype(e.target.value)}
                  value={analyticstype}
                >
                  <option value="All">All</option>
                  {qrs?.map((elm) => {
                    return <option value={elm?._id}>{elm?.name}</option>;
                  })}
                </select>
              </div> */}

              <button
                className="w-[185px] h-[53px] rounded-[12px] shadow-lg flex items-center justify-evenly gap-2 cursor-pointer"
                id="filter-button"
                aria-haspopup="listbox"
                aria-controls="filter-menu"
                // aria-expanded={openMenu ? "true" : undefined}
                onClick={handleClickListItem3}
              >
                <p className="font-[400] text-[16px] text-[#FE5B24] flex items-center w-[70%] ">
                  {qrName}
                </p>
                <IoIosArrowDown className="text-[#FE5B24] text-[20px]" />
              </button>
              <Menu
                id="filter-button"
                anchorEl={anchorEl3}
                open={open3}
                onClose={handleClose3}
                MenuListProps={{
                  "aria-labelledby": "filter-button",
                  role: "listbox",
                }}
              >
                <MenuItem
                  onClick={() => {
                    getQrInfo("All", "All"), handleClose3();
                  }}
                  sx={{ display: "flex" }}
                >
                  All
                </MenuItem>
                {qrs?.map((elm) => {
                  return (
                    <>
                      <MenuItem
                        onClick={() => {
                          getQrInfo(elm?.name, elm?._id), handleClose3();
                        }}
                        sx={{ display: "flex" }}
                      >
                        {elm?.name}
                      </MenuItem>
                    </>
                  );
                })}
              </Menu>

              <div
                className="w-[185px] h-[53px] rounded-[12px] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                onClick={() => navigate("/dashboard/create")}
              >
                <IoAddCircleOutline className="text-[#FE5B24] text-[20px]" />
                <p className="font-[400] text-[16px] text-[#FE5B24] flex items-center">
                  Create QR Code
                </p>
              </div>
            </div>
          </div>

          <div className="w-[100%] h-[85%]  flex justify-between">
            <div className="w-[70%] h-[100%]  flex flex-col justify-between">
              {analyticstype === "All" && (
                <div className="w-[100%] h-[30%] shadow-md border rounded-[14px] flex ">
                  <div className="w-[25%] h-[100%] flex items-center border-r">
                    <div className="w-[100%] h-[80%] flex flex-col items-center">
                      <h2 className="font-[600] text-[16px] text-[#565656]">
                        Total QR Codes:
                      </h2>
                      <h2 className="text-[#FE5B24] font-[600] text-[64px] leading-[74px]">
                        {analytics?.activeQrs + analytics?.inactiveQrs}
                      </h2>
                    </div>
                  </div>
                  <div className="w-[75%] h-[100%] flex items-center justify-evenly">
                    <div className="w-[45%] h-[90%] border rounded-[23px] shadow-md flex flex-col  items-center justify-center gap-2">
                      <div className="h-[38px] w-[38px] rounded-full bg-[#DCFFD9] flex justify-center items-center ">
                        <MdOutlineAutoGraph className="text-[#28DE18] text-xl" />
                      </div>
                      <h2 className="font-[600] text-[40px] text-[#28DE18]  leading-[30px]">
                        {analytics?.activeQrs}
                      </h2>
                      <p className="font-[600] text-[12px] text-[#28DE18]">
                        Active Qr Codes
                      </p>
                    </div>

                    <div className="w-[45%] h-[90%] border rounded-[23px] shadow-md flex flex-col  items-center justify-center gap-2">
                      <div className="h-[38px] w-[38px] rounded-full bg-[#FFCECE] flex justify-center items-center ">
                        <IoIosPause className="text-[#EE0000] text-xl" />
                      </div>
                      <h2 className="font-[600] text-[40px] text-[#EE0000]  leading-[30px]">
                        {analytics?.inactiveQrs}
                      </h2>
                      <p className="font-[600] text-[12px] text-[#EE0000]">
                        Paused Qr Codes
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div
                className="w-[100%] border rounded-[14px] shadow-md flex flex-col items-center justify-center "
                style={{ height: analyticstype === "All" ? "65%" : "100%" }}
              >
                <div className="w-[95%]  mt-4 flex justify-between items-center">
                  <p className="text-[#FE5B24] font-[500] text-[16px]">
                    QR Code Scans Over Time
                  </p>

                  <>
                    {" "}
                    <button
                      // component="nav"
                      // aria-label="Device settings"
                      id="lang-button"
                      aria-haspopup="listbox"
                      aria-controls="lang-menu"
                      // aria-expanded={openMenu ? "true" : undefined}
                      onClick={handleClickListItem}
                      className="w-[120px] h-[45px] outline-none rounded-[4px] border bg-white shadow-lg flex justify-evenly items-center cursor-pointer"
                    >
                      <p className="font-[500] text-[#FE5B24] text-[15px]">
                        {statValue}
                      </p>
                      <MdArrowDropDown className="text-2xl" />
                    </button>
                    <Menu
                      id="lang-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "lang-button",
                        role: "listbox",
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleGetValue("weakly");
                        }}
                        sx={{ display: "flex" }}
                      >
                        <p className="font-[500] ml-2 text-base">Weakly</p>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleGetValue("monthly");
                        }}
                        sx={{ display: "flex" }}
                      >
                        <p className="font-[500] ml-2 text-base">Monthly</p>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleGetValue("yearly");
                        }}
                        sx={{ display: "flex" }}
                      >
                        <p className="font-[500] ml-2 text-base">Yearly</p>
                      </MenuItem>
                    </Menu>
                  </>
                </div>
                <div
                  className="w-[100%] 
                h-[80%]  flex justify-center items-start  overflow-y-scroll"
                >
                  {scanAnalytics?.length > 0 ? (
                    <Line
                      data={
                        scanAnalytics?.length === 30
                          ? monthChartData
                          : scanAnalytics?.length === 12
                          ? yearChartData
                          : weekChartData
                      }
                      className="w-[80%]"
                    />
                  ) : (
                    <div className="h-[300px] "></div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-[28%] h-[100%]  flex flex-col justify-between items-center">
              <div className="w-[95%] h-[30%] rounded-[14px] shadow-md border flex flex-col  items-center justify-center gap-2 ">
                <div className="h-[50px] w-[50px] rounded-full bg-[#FFD4C6] flex justify-center items-center ">
                  <IoDownload className="text-[#FE5B24] text-2xl" />
                </div>
                <p className="font-[600] text-[12px] text-[#FE5B24]">
                  Your Total Downloads
                </p>
                <h2 className="font-[600] text-[40px] text-[#FE5B24]  leading-[30px]">
                  {analytics?.totalQrDownload}
                </h2>
              </div>

              <div className="w-[95%] h-[30%] rounded-[14px] shadow-md border flex flex-col  items-center justify-center gap-2 ">
                <div className="h-[50px] w-[50px] rounded-full bg-[#FFD4C6] flex justify-center items-center ">
                  <IoIosQrScanner className="text-[#FE5B24] text-2xl" />
                </div>
                <p className="font-[600] text-[12px] text-[#FE5B24]">
                  Total QR Code Scans
                </p>
                <h2 className="font-[600] text-[40px] text-[#FE5B24]  leading-[30px]">
                  {analytics?.totalQrScan}
                </h2>
              </div>

              <div className="w-[95%] h-[30%] rounded-[14px] shadow-md border flex flex-col  items-center justify-center gap-2 ">
                <div className="h-[50px] w-[50px] rounded-full bg-[#FFD4C6] flex justify-center items-center ">
                  <IoDownload className="text-[#FE5B24] text-2xl" />
                </div>
                <p className="font-[600] text-[12px] text-[#FE5B24]">
                  Downloaded This Month
                </p>
                <h2 className="font-[600] text-[40px] text-[#FE5B24]  leading-[30px]">
                  {analytics?.totalQrDownloadCrntMonth}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <ToastContainer
        position="bottom-left"
        autoClose={1000}
        theme="colored"
        hideProgressBar
      /> */}
    </div>
  );
};

export default Analytics;
