import { SlArrowLeft } from "react-icons/sl";
import { useNavigate, useParams } from "react-router-dom";
import { GiEarthAmerica } from "react-icons/gi";
import { IoIosArrowDown, IoMdColorPalette } from "react-icons/io";
import { FaImages } from "react-icons/fa";
import { IoQrCodeOutline } from "react-icons/io5";
import Content from "../components/createComponents/Content";
import { QRCode } from "react-qrcode-logo";
import { useEffect, useState } from "react";
import { Menu, MenuItem, Slider, styled } from "@mui/material";
import { FiDownload } from "react-icons/fi";
import Color from "../components/createComponents/Color";
import Logo from "../components/createComponents/Logo";
import Custom from "../components/createComponents/Custom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
// import ActionModal from "../components/Modals/ActionModal";
import toast, { Toaster } from "react-hot-toast";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { ClipLoader } from "react-spinners";
import { AiOutlineExclamationCircle } from "react-icons/ai";
// import debounce from "lodash.debounce";
const iOSBoxShadow =
  "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";
const IOSSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#0a84ff" : "#FE5B24",
  height: 5,
  padding: "15px 0",
  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    backgroundColor: "#FE5B24",
    boxShadow: "0 0 2px 0px rgba(0, 0, 0, 0.1)",
    "&:focus, &:hover, &.Mui-active": {
      boxShadow: "0px 0px 3px 1px rgba(0, 0, 0, 0.1)",
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        boxShadow: iOSBoxShadow,
      },
    },
    "&:before": {
      boxShadow:
        "0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)",
    },
  },
  "& .MuiSlider-valueLabel": {
    fontSize: 12,
    fontWeight: "normal",
    top: -6,
    backgroundColor: "unset",
    color: theme.palette.text.primary,
    "&::before": {
      display: "none",
    },
    "& *": {
      background: "transparent",
      color: theme.palette.mode === "dark" ? "#fff" : "#000",
    },
  },
  "& .MuiSlider-track": {
    border: "none",
    height: 5,
  },
  "& .MuiSlider-rail": {
    opacity: 0.5,
    boxShadow: "inset 0px 0px 4px -2px #000",
    backgroundColor: "#d0d0d0",
  },
}));
const Create = () => {
  const naviget = useNavigate();
  let { id } = useParams();
  console.log(id);

  const token = localStorage.getItem("gbQrId");
  let baseUrl = import.meta.env.VITE_BASE_URL;
  const [loading, setLoading] = useState<boolean>(false);
  const [qr, setqr] = useState<{
    _id: string;
    url: string;
    forColor: string;
    bgColor: string;
    eyeColor: string;
    logo: string;
    bodyShape: string;
    eyeShape: string;
    frameShape: string;
    status: Boolean;
    totalScans: number;
    userId: string;
  }>({
    _id: "",
    url: "",
    forColor: "",
    bgColor: "",
    eyeColor: "",
    logo: "",
    bodyShape: "",
    eyeShape: "",
    frameShape: "",
    status: true,
    totalScans: 0,
    userId: "",
  });

  let [qrInfo, setQrInfo] = useState<{
    name: string;
    value: string;
    forColor: string;
    forColor2: string;
    iColor: string;
    iColor2: string;
    bgColor: string;
    logo: string;
    bShape: "squares" | "dots" | undefined;
    iShape: [number, number, number, number];
    fShape: [number, number, number, number];
  }>({
    name: "",
    value: "",
    forColor: "#707070",
    forColor2: "#000000",
    iColor: "#707070",
    iColor2: "#000000",
    bgColor: "#ffffff",
    logo: "",
    bShape: "squares",
    iShape: [0, 0, 0, 0],
    fShape: [0, 0, 0, 0],
  });

  // const stringToArray = (
  //   stringValue: string
  // ): [number, number, number, number] => {
  //   if (stringValue && stringValue != undefined) {
  //     const stringArray = stringValue?.split(",");
  //     const numberArray: [number, number, number, number] = stringArray.map(
  //       (str) => parseInt(str, 10)
  //     );
  //     return numberArray;
  //   }
  // };

  const stringToArray = (
    stringValue: string
  ): [number, number, number, number] => {
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

  const getSingleQr = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/qr/getSingle`,
        { qrId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const singleQrData = response.data?.data;
      setQrInfo({
        name: singleQrData?.name,
        value: singleQrData?.url,
        forColor: singleQrData?.forColor,
        forColor2: singleQrData?.bgColor,
        iColor: singleQrData?.eyeColor,
        iColor2: "#000000",
        bgColor: singleQrData?.bgColor,
        logo: singleQrData?.logo,
        bShape: "squares",
        iShape: stringToArray(singleQrData?.eyeShape),
        fShape: stringToArray(singleQrData?.frameShape),
      });
      setqr(response.data?.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getSingleQr();
    }
  }, [id]);

  console.log(qr);

  const [quality, setquality] = useState<number>(0);

  const handleChangeSlider = (event: Event, newValue: number | number[]) => {
    setquality(newValue as number);
    console.log(event);
  };

  // const handleChangeSlider = useCallback(
  //   debounce((event: Event, newValue: number | number[]) => {
  //     setquality(newValue as number);
  //     console.log(event);
  //   }, 100),
  //   []
  // );

  // const swapForColors = () => {
  //   setQrInfo((prevQrInfo) => ({
  //     ...prevQrInfo,
  //     forColor: prevQrInfo.forColor2,
  //     forColor2: prevQrInfo.forColor,
  //   }));
  // };

  // const swapIColors = () => {
  //   setQrInfo((prevQrInfo) => ({
  //     ...prevQrInfo,
  //     iColor: prevQrInfo.iColor2,
  //     iColor2: prevQrInfo.iColor,
  //   }));
  // };

  // -------------------------------------------------Edit qrInfo state----------------------------------------------

  const editQrInfo = (
    infoValue: string | number[] | File | "squares" | "dots" | undefined,
    key: string
  ) => {
    setQrInfo({ ...qrInfo, [key]: infoValue });
  };

  // -------------------------------------------------Download Qr----------------------------------------------

  const downloadQRCode = async (
    format: "jpg" | "png" | "pdf",
    width: number,
    height: number
  ) => {
    const qrCodeElement = document.getElementById("qrCodeContainer");

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

    await axios.post(
      `${baseUrl}/analytics/update`,
      { type: "download", qrId: id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [format, setFormat] = useState<"jpg" | "png" | "pdf">("png");

  let [navigate, setNavigate] = useState<{
    isContent: boolean;
    isColor: boolean;
    isLogo: boolean;
    isCustom: boolean;
  }>({ isContent: true, isColor: false, isLogo: false, isCustom: false });

  const handleRoute = (route: string) => {
    if (route === "content") {
      setNavigate({
        isContent: true,
        isColor: false,
        isLogo: false,
        isCustom: false,
      });
    } else if (route === "color") {
      setNavigate({
        isContent: false,
        isColor: true,
        isLogo: false,
        isCustom: false,
      });
    } else if (route === "logo") {
      setNavigate({
        isContent: false,
        isColor: false,
        isLogo: true,
        isCustom: false,
      });
    } else if (route === "custom") {
      setNavigate({
        isContent: false,
        isColor: false,
        isLogo: false,
        isCustom: true,
      });
    }
  };
  console.log(qrInfo.logo);

  const returnIfHttps = (inputString: string | null | undefined): boolean => {
    if (inputString && inputString !== "") {
      if (
        inputString.slice(0, 4) === "http" ||
        inputString.slice(0, 4) === "/src" ||
        inputString.slice(0, 7) === "/assets"
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  const createNewQr = async () => {
    try {
      if ((qrInfo?.value, qrInfo?.name)) {
        setLoading(true);
        if (returnIfHttps(qrInfo.logo) === false) {
          let name = new Date().getTime() + qrInfo?.name;
          const storageRef = ref(storage, name);
          uploadString(storageRef, qrInfo.logo?.slice(22), "base64", {
            contentType: "image/png",
          })
            .then(() => {
              console.log("img testing");
              getDownloadURL(storageRef)
                .then(async (URL) => {
                  const apiFormDataImg = new FormData();
                  apiFormDataImg.append("qrId", id ? id : "");
                  apiFormDataImg.append("name", qrInfo.name);
                  apiFormDataImg.append("url", qrInfo.value);
                  apiFormDataImg.append("forColor", qrInfo.forColor);
                  apiFormDataImg.append("forColor2", qrInfo.forColor2);
                  apiFormDataImg.append("iColor", qrInfo.iColor);
                  apiFormDataImg.append("iColor2", qrInfo.iColor2);
                  apiFormDataImg.append("bgColor", qrInfo.bgColor);
                  apiFormDataImg.append("bodyShape", `${qrInfo.bShape}`);
                  apiFormDataImg.append("eyeShape", `${qrInfo.iShape}`);
                  apiFormDataImg.append("frameShape", `${qrInfo.fShape}`);
                  apiFormDataImg.append("logo", URL);
                  const response = await axios.post(
                    `${baseUrl}/qr/create`,
                    apiFormDataImg,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  setLoading(false);
                  toast.success(response?.data?.msg);
                  setQrInfo({
                    name: "",
                    value: "",
                    forColor: "#707070",
                    forColor2: "#000000",
                    iColor: "#707070",
                    iColor2: "#000000",
                    bgColor: "#ffffff",
                    logo: "",
                    bShape: "squares",
                    iShape: [0, 0, 0, 0],
                    fShape: [0, 0, 0, 0],
                  });
                  handleRoute("content");
                  naviget("/dashboard/history");
                })
                .catch((error) => {
                  console.log(error);
                });
              // setimg(null)
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          const apiFormData = new FormData();
          apiFormData.append("qrId", id ? id : "");
          apiFormData.append("name", qrInfo.name);
          apiFormData.append("url", qrInfo.value);
          apiFormData.append("forColor", qrInfo.forColor);
          apiFormData.append("forColor2", qrInfo.forColor2);
          apiFormData.append("iColor", qrInfo.iColor);
          apiFormData.append("iColor2", qrInfo.iColor2);
          apiFormData.append("bgColor", qrInfo.bgColor);
          apiFormData.append("bodyShape", `${qrInfo.bShape}`);
          apiFormData.append("eyeShape", `${qrInfo.iShape}`);
          apiFormData.append("frameShape", `${qrInfo.fShape}`);
          apiFormData.append("logo", qrInfo.logo);
          const response = await axios.post(
            `${baseUrl}/qr/create`,
            apiFormData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setLoading(false);
          console.log(response);
          toast.success(response?.data?.msg);
          setQrInfo({
            name: "",
            value: "",
            forColor: "#707070",
            forColor2: "#000000",
            iColor: "#707070",
            iColor2: "#000000",
            bgColor: "#ffffff",
            logo: "",
            bShape: "squares",
            iShape: [0, 0, 0, 0],
            fShape: [0, 0, 0, 0],
          });
          handleRoute("content");
          naviget("/dashboard/history");
        }

        // setActionString(response?.data?.msg);
        // handlecloseAction();
      } else {
        toast.error("Url field or name should not be empty!");
        setLoading(false);
        // setActionString("Url field or name should not be empty!");
        // handlecloseAction();
      }
    } catch (error) {
      setLoading(false);
      console.error("Error posting data:", error);
    }
  };

  // let uniqueDate = Date;
  // console.log(uniqueDate.now());
  const [logoSrc, setLogoSrc] = useState<string>("");
  useEffect(() => {
    const cnvrtTo64 = async () => {
      if (qrInfo?.logo) {
        const base64: string = await fetch(qrInfo.logo)
          .then((response) => response.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            return new Promise<string>((res, rej) => {
              reader.onloadend = () => {
                if (typeof reader.result === "string") {
                  res(reader.result);
                } else {
                  rej("Failed to convert to base64 string");
                }
              };
            });
          });
        setLogoSrc(base64);
      }
    };
    cnvrtTo64();
  }, [qrInfo?.logo]);

  // console.log(logoSrc);

  return (
    <div className="h-[100vh] w-[100%]">
      <Toaster />
      <div className="w-[100%] h-[12%] shadow-sm border-b flex items-center ">
        <div
          className="flex h-[50px] items-center gap-[6px] text-[24px] font-[600] ml-[35px] text-[#FE5B24] cursor-pointer"
          onClick={() => naviget(-1)}
        >
          <SlArrowLeft className="text-lg" />
          Back
        </div>
      </div>
      {/* <ActionModal
        handlecloseAction={handlecloseAction}
        actionModal={actionModal}
        actionString={actionString}
        actionMethod={() => {
          handlecloseAction(), naviget("/dashboard");
        }}
      /> */}
      <div className="w-[100%] h-[88%] flex justify-center items-center ">
        <div className="w-[95%] h-[88%]  flex justify-between">
          <div className="w-[25%] h-[100%] border-r flex justify-center items-center">
            <div className="h-[90%] w-[90%]  flex flex-col items-start justify-evenly">
              <div
                className="w-[90%] h-[65px]  rounded-[14px] flex justify-center items-center gap-2 text-[#FE5B24] font-[600] text-[22px] cursor-pointer"
                onClick={() => handleRoute("content")}
                style={
                  navigate?.isContent
                    ? { backgroundColor: "#FFDED2", color: "#FE5B24" }
                    : { backgroundColor: "#EBEBEB", color: "#838383" }
                }
              >
                <GiEarthAmerica className="text-[22px]" />
                Content
              </div>
              <div
                className="w-[90%] h-[65px]  rounded-[14px] flex justify-center items-center gap-2  font-[600] text-[20px] cursor-pointer"
                onClick={() => handleRoute("color")}
                style={
                  navigate?.isColor
                    ? { backgroundColor: "#FFDED2", color: "#FE5B24" }
                    : { backgroundColor: "#EBEBEB", color: "#838383" }
                }
              >
                <IoMdColorPalette className="text-[24px]" />
                Set Colors
              </div>

              <div
                className="w-[90%] h-[65px]  rounded-[14px] flex justify-center items-center gap-2 font-[600] text-[20px] cursor-pointer"
                onClick={() => handleRoute("logo")}
                style={
                  navigate?.isLogo
                    ? { backgroundColor: "#FFDED2", color: "#FE5B24" }
                    : { backgroundColor: "#EBEBEB", color: "#838383" }
                }
              >
                <FaImages className="text-[24px]" />
                Logo Image
              </div>

              <div
                className="w-[90%] h-[65px]  rounded-[14px] flex justify-center items-center gap-2  font-[600] text-[20px] cursor-pointer"
                onClick={() => handleRoute("custom")}
                style={
                  navigate?.isCustom
                    ? { backgroundColor: "#FFDED2", color: "#FE5B24" }
                    : { backgroundColor: "#EBEBEB", color: "#838383" }
                }
              >
                <IoQrCodeOutline className="text-[24px]" />
                Customize
              </div>
            </div>
          </div>

          <div className="w-[52%] h-[100%] flex justify-center items-center">
            {navigate?.isContent && (
              <Content
                editQrInfo={editQrInfo}
                qrInfo={qrInfo}
                handleRoute={handleRoute}
              />
            )}
            {navigate?.isColor && (
              <Color
                editQrInfo={editQrInfo}
                qrInfo={qrInfo}
                handleRoute={handleRoute}
              />
            )}
            {navigate?.isLogo && (
              <Logo
                editQrInfo={editQrInfo}
                qrInfo={qrInfo}
                handleRoute={handleRoute}
              />
            )}
            {navigate?.isCustom && (
              <Custom
                editQrInfo={editQrInfo}
                qrInfo={qrInfo}
                handleRoute={handleRoute}
              />
            )}
          </div>

          <div className="w-[22%] h-[100%] border-l flex flex-col justify-around items-center relative overflow-hidden ">
            {qrInfo?.logo && (
              <div
                className="h-[90px] w-[90px] left-[35%] absolute overflow-hidden flex justify-center items-center "
                style={{ top: id ? "18%" : "25%" }}
              >
                <img
                  src={qrInfo?.logo}
                  alt=""
                  className=" max-h-[90%] max-w-[90%]  object-fit object-center"
                />
              </div>
            )}
            <QRCode
              // id="qrCodeContainer"
              value={qrInfo?.value}
              fgColor={qrInfo?.forColor}
              bgColor={qrInfo?.bgColor}
              eyeColor={qrInfo?.iColor}
              qrStyle={qrInfo?.bShape}
              logoHeight={80}
              logoWidth={80}
              // logoImage={
              //   typeof qrInfo?.logo === "string" ? qrInfo?.logo : undefined
              // }
              eyeRadius={[
                {
                  // top/left eye
                  outer: qrInfo?.fShape,
                  inner: qrInfo?.iShape,
                },
                {
                  // top/left eye
                  outer: qrInfo?.fShape,
                  inner: qrInfo?.iShape,
                },
                {
                  // top/left eye
                  outer: qrInfo?.fShape,
                  inner: qrInfo?.iShape,
                },
              ]}
              size={220}
            />
            {id && (
              <div className="w-[100%] flex flex-col items-center ">
                <p className=" text-[13px] text-[#FE5B24] flex items-center gap-[2px]">
                  <AiOutlineExclamationCircle className="text-[15px] text-[#FE5B24]" />
                  QR quality is not saveable
                </p>
                <IOSSlider
                  aria-label="ios slider"
                  defaultValue={60}
                  value={quality}
                  onChange={handleChangeSlider}
                  sx={{ width: "90%" }}
                />
                <div className="w-[90%] flex justify-between items-center">
                  <p className="font-[600] text-[10px] text-[#C0C0C0]">
                    Low Quality
                  </p>
                  <p className="font-[600] text-[14px] text-[#C0C0C0]">
                    {quality * 16}x{quality * 16}px
                  </p>
                  <p className="font-[600] text-[10px] text-[#C0C0C0]">
                    High Quality
                  </p>
                </div>
              </div>
            )}
            {/* {navigate?.isCustom && ( */}
            <div className="w-[85%] h-[50px] rounded-[12px] flex border border-[#FE5B24]">
              {id ? (
                <div
                  className="h-[100%] w-[100%] flex justify-center items-center gap-2 cursor-pointer text-[#FE5B24] font-[500] text-[18px]"
                  onClick={() => createNewQr()}
                >
                  {loading ? (
                    <ClipLoader
                      color="#FE5B24"
                      loading={true}
                      size={45}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    "Update"
                  )}
                </div>
              ) : (
                <div
                  className="h-[100%] w-[100%] flex justify-center items-center gap-2 cursor-pointer text-[#FE5B24] font-[500] text-[18px]"
                  onClick={() => createNewQr()}
                >
                  {loading ? (
                    <ClipLoader
                      color="#FE5B24"
                      loading={true}
                      size={45}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    "Create"
                  )}
                </div>
              )}
            </div>
            {/* // )} */}
            {id && (
              <div className="w-[85%] h-[50px] rounded-[12px] flex bg-[#FE5B24]">
                <div
                  className="h-[100%] w-[75%] border-r flex justify-center items-center gap-2 cursor-pointer text-[#FFFFFF] font-[500] text-[14px]"
                  onClick={() =>
                    downloadQRCode(format, quality * 16, quality * 16)
                  }
                >
                  <FiDownload className="text-xl" />
                  Download {format}
                </div>
                <div
                  className="h-[100%] w-[25%] flex justify-center items-center "
                  // aria-label="Device settings"
                  id="lang-button"
                  aria-haspopup="listbox"
                  aria-controls="lang-menu"
                  // aria-expanded={openMenu ? "true" : undefined}
                  onClick={handleClickListItem}
                >
                  <IoIosArrowDown className="text-2xl cursor-pointer text-white" />
                </div>
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
                      setFormat("png"), handleClose();
                    }}
                    sx={{ display: "flex" }}
                  >
                    .png
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setFormat("jpg"), handleClose();
                    }}
                    sx={{ display: "flex" }}
                  >
                    .jpg
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setFormat("pdf"), handleClose();
                    }}
                    sx={{ display: "flex" }}
                  >
                    .pdf
                  </MenuItem>
                </Menu>
              </div>
            )}

            <div
              style={{
                position: "absolute",
                bottom: "-2500px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="relative"
                style={{ height: quality * 15, width: quality * 15 }}
                id="qrCodeContainer"
              >
                {qrInfo?.logo && (
                  <div className="h-[37%] w-[37%] left-[32%] absolute overflow-hidden flex justify-center items-center top-[30%]">
                    <img
                      src={logoSrc}
                      alt=""
                      className=" max-h-[90%] max-w-[90%]  object-fit object-center"
                    />
                  </div>
                )}

                <QRCode
                  value={qrInfo?.value}
                  size={quality * 15}
                  fgColor={qrInfo?.forColor}
                  bgColor={qrInfo?.bgColor}
                  eyeColor={qrInfo?.iColor}
                  qrStyle={qrInfo?.bShape}
                  // logoImage={qrInfo?.logo}

                  // logoImage={
                  //   typeof qrInfo?.logo === "string" ? qrInfo?.logo : undefined
                  // }
                  eyeRadius={[
                    {
                      // top/left eye
                      outer: qrInfo?.fShape,
                      inner: qrInfo?.iShape,
                    },
                    {
                      // top/left eye
                      outer: qrInfo?.fShape,
                      inner: qrInfo?.iShape,
                    },
                    {
                      // top/left eye
                      outer: qrInfo?.fShape,
                      inner: qrInfo?.iShape,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
