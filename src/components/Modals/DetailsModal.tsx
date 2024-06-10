import React, { useEffect, useState } from "react";
import { Box, Menu, MenuItem, Modal } from "@mui/material";
import { RxCross2 } from "react-icons/rx";

import "react-image-crop/dist/ReactCrop.css";
import { QRCode } from "react-qrcode-logo";
import { MdArrowDropDown, MdOutlineAutoGraph } from "react-icons/md";
import { IoIosArrowDown, IoIosPause } from "react-icons/io";
import { TbUnlink } from "react-icons/tb";
import { IoCopyOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import axios from "axios";
import { LineChart } from "@mui/x-charts/LineChart";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ActionProps {
  detailModal: boolean;
  handlecloseAction: () => void;
  singleQr: {
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
  };
}

const DetailsModal: React.FC<ActionProps> = ({
  detailModal,
  handlecloseAction,
  singleQr,
}) => {
  console.log(singleQr?.frameShape);
  const style2: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: 520,
    width: 540,
    outline: "none",
  };

  // const [analyticstype, setanalyticstype] = useState<string>("All");
  const [format, setFormat] = useState<string>("png");

  const token = localStorage.getItem("gbQrId");
  let baseUrl = import.meta.env.VITE_BASE_URL;
  // ---------------------------------------------get scan analytics api call-------------------------------------
  const [statValue, setStatValue] = useState<string>("weakly");
  const [scanAnalytics, setScanAnalytics] = useState<number[]>([]);
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

  console.log(scanAnalytics);

  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const open2 = Boolean(anchorEl2);

  const handleClickListItem2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget);
    console.log("work");
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

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

  const stringToArray = (
    stringValue: string
  ): [number, number, number, number] => {
    console.log("example", stringValue);
    if (stringValue && stringValue != undefined) {
      const stringArray = stringValue.split(",");
      const numberArray = stringArray.map((str) => parseInt(str, 10)) as [
        number,
        number,
        number,
        number
      ]; // Type assertion

      return numberArray;
    } else {
      throw new Error("Invalid input");
    }
  };

  useEffect(() => {
    getScanAnalyticsData("weakly", singleQr?._id);
  }, [singleQr?._id]);

  // -------------------------------------------------Download Qr----------------------------------------------

  const downloadQRCode = async (
    format: "jpg" | "png" | "pdf" | string,
    width: number,
    height: number,
    qrId: string
  ) => {
    try {
      const response = await axios.post(
        `${baseUrl}/analytics/update`,
        { type: "download", qrId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const qrCodeElement = document.getElementById(qrId);

      if (!qrCodeElement) {
        console.error("QR code container not found.");
        return;
      }

      interface QRCodeOptions {
        scale: number;
        width?: number;
        height?: number;
      }

      const options: QRCodeOptions = { scale: 100 / 100 };
      if (width && height) {
        options.width = width;
        options.height = height;
      }

      qrCodeElement.style.margin = "0";
      qrCodeElement.style.padding = "0";
      qrCodeElement.style.border = "none";

      if (format === "pdf") {
        html2canvas(qrCodeElement, options).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
          pdf.save("QRCode.pdf");
        });
      } else {
        html2canvas(qrCodeElement, options).then((canvas) => {
          const imgData = canvas.toDataURL(`image/${format}`, 100 / 100);
          const downloadLink = document.createElement("a");
          downloadLink.href = imgData;
          downloadLink.download = `QRCode.${format}`;
          downloadLink.click();
        });
      }

      // setStatValue("");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <Modal
      open={detailModal}
      onClose={handlecloseAction}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style2}>
        <div className="w-[100%] h-[100%] bg-white rounded-3xl">
          <div className="w-[98%] flex justify-end mt-2">
            <RxCross2
              className="cursor-pointer text-[#FE5B24] text-4xl"
              onClick={() => handlecloseAction()}
            />
          </div>

          <div className="w-[100%] flex justify-center mt-3">
            <div className="w-[85%] flex justify-between ">
              <div className="w-[40%]">
                {singleQr?.frameShape && singleQr?.eyeShape && (
                  <QRCode
                    id={singleQr?._id}
                    value={`${baseUrl}/qr/${singleQr?._id}`}
                    fgColor={singleQr.forColor}
                    bgColor={singleQr?.bgColor}
                    eyeColor={singleQr?.eyeColor}
                    qrStyle={singleQr?.bodyShape}
                    logoImage={singleQr?.logo}
                    eyeRadius={[
                      {
                        // top/left eye
                        outer: stringToArray(singleQr?.frameShape),
                        inner: stringToArray(singleQr?.eyeShape),
                      },
                      {
                        // top/left eye
                        outer: stringToArray(singleQr?.frameShape),
                        inner: stringToArray(singleQr?.eyeShape),
                      },
                      {
                        // top/left eye
                        outer: stringToArray(singleQr?.frameShape),
                        inner: stringToArray(singleQr?.eyeShape),
                      },
                    ]}
                    size={160}
                  />
                )}
              </div>
              <div className="w-[55%]">
                {singleQr?.status ? (
                  <div
                    className="h-[30px] w-[100px] border bg-white border-[#28DE18] rounded-[9px] flex justify-center items-center gap-1 font-[600] text-[14px] text-[#28DE18]"
                    // onClick={() =>
                    //   updateAnalyticsStatus("status", qr?._id, !qr?.status)
                    // }
                  >
                    <MdOutlineAutoGraph className="text-xl text-[#28DE18]" />
                    Active
                  </div>
                ) : (
                  <div
                    className="h-[30px] w-[100px] border bg-white border-[#EE0000] rounded-[9px] flex  justify-center items-center gap-1 font-[600] text-[14px] text-[#EE0000]"
                    // onClick={() =>
                    //   updateAnalyticsStatus("status", qr?._id, !qr?.status)
                    // }
                  >
                    <IoIosPause className="text-xl text-[#EE0000]" />
                    Paused
                  </div>
                )}

                <div className="flex  items-center justify-between mt-3">
                  <div className="flex">
                    <TbUnlink className="text-[20px] text-[#9F9F9F] " />
                    <p className="font-[500] text-[14px] text-[#9F9F9F] ml-1">
                      {singleQr?.url?.length < 22
                        ? singleQr?.url
                        : singleQr?.url.slice(0, 22) + "..."}
                    </p>
                  </div>

                  <IoCopyOutline className="text-[#EE0000] cursor-pointer" />
                </div>

                <div className="w-[100%] flex justify-between items-center mt-3">
                  <p className="font-[400] text-[22px] text-[#AFAFAF]">
                    Total Scans:
                  </p>
                  <p className="text-[#FE5B24] text-[38px] font-[600]">
                    {singleQr?.totalScans}
                  </p>
                </div>

                <div className="w-[100%] h-[49px] rounded-[12px] flex bg-[#FE5B24] mt-4">
                  <div
                    className="h-[100%] w-[75%] border-r flex justify-center items-center gap-2 cursor-pointer text-[#FFFFFF] font-[500] text-[14px]"
                    onClick={() =>
                      downloadQRCode(format, 200, 200, singleQr?._id)
                    }
                  >
                    <FiDownload className="text-xl" />
                    Download {format}{" "}
                  </div>
                  <button
                    className="h-[100%] w-[25%] flex justify-center items-center "
                    id="download-button"
                    aria-haspopup="listbox"
                    aria-controls="download-menu"
                    // aria-expanded={openMenu ? "true" : undefined}
                    onClick={handleClickListItem2}
                  >
                    <IoIosArrowDown className="text-2xl cursor-pointer text-white" />
                  </button>

                  <Menu
                    id="download-button"
                    anchorEl={anchorEl2}
                    open={open2}
                    onClose={handleClose2}
                    MenuListProps={{
                      "aria-labelledby": "download-button",
                      role: "listbox",
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setFormat("png"), handleClose2();
                      }}
                      sx={{ display: "flex" }}
                    >
                      .png
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setFormat("jpg"), handleClose2();
                      }}
                      sx={{ display: "flex" }}
                    >
                      .jpg
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setFormat("pdf"), handleClose2();
                      }}
                      sx={{ display: "flex" }}
                    >
                      .pdf
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[95%]  flex justify-end mt-3 items-center">
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
                    getScanAnalyticsData("weakly", singleQr?._id),
                      handleGetValue("weakly");
                  }}
                  sx={{ display: "flex" }}
                >
                  <p className="font-[500] ml-2 text-base">Weakly</p>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    getScanAnalyticsData("monthly", singleQr?._id),
                      handleGetValue("monthly");
                  }}
                  sx={{ display: "flex" }}
                >
                  <p className="font-[500] ml-2 text-base">Monthly</p>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    getScanAnalyticsData("yearly", singleQr?._id),
                      handleGetValue("yearly");
                  }}
                  sx={{ display: "flex" }}
                >
                  <p className="font-[500] ml-2 text-base">Yearly</p>
                </MenuItem>
              </Menu>
            </>
          </div>

          {scanAnalytics?.length > 0 ? (
            <LineChart
              xAxis={[
                {
                  data:
                    scanAnalytics?.length === 12
                      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                      : scanAnalytics?.length === 30
                      ? [
                          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                          17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
                          30,
                        ]
                      : [1, 2, 3, 4, 5, 6, 7],
                },
              ]}
              series={[
                {
                  data: scanAnalytics,
                  // scanAnalytics,
                  area: true,
                  color: "#FFCECE",
                },
              ]}
              width={520}
              height={200}
            />
          ) : (
            <div className="h-[300px] "></div>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default DetailsModal;
