import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [dcp, setDcp] = useState(0.0);
  const [result, setResult] = useState(0.0);
  const [curValue, setCurValue] = useState(0.0);
  const [dcpflag, setDcpflag] = useState(false);
  const [listData, setListData] = useState([]);
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [a, setA] = useState(0);
  const [chgPos, setChgPos] = useState(true);
  const [last, setLast] = useState(0.0);
  const [seld_s, setSeld_s] = useState("");
  useEffect(() => {
    getCurrentResult();
  }, []);

  const getDCP = () =>
    new Promise((resolve, reject) => {
      axios
        .get("https://metrics.router.democraticcooperative.cash/metrics/last")
        .then((response) => {
          let text = "";
          for (const x in response.data) {
            text += response.data[x] + ", ";
          }
          setDcp(parseFloat(text));
          resolve(1);
        })
        .catch((err) => {
          console.error("Error:", err);
          reject(err);
        });
    });

  const getTicker = () =>
    new Promise((resolve, reject) => {
      axios
        .get("https://blockchain.info/ticker")
        .then((response) => {
          for (const x in response.data) {
            let row = {
              curtype: x,
              value: parseFloat(response.data[x].last),
            };
            setListData((listData) => [...listData, row]);
          }
          resolve(1);
        })
        .catch((e) => reject(e));
    });
  const getCurrentResult = async () => {
    await getDCP();
    await getTicker();
  };
  function showCurrency(e) {
    setX("");
    setY("");
    setA(1);
    setLast(
      parseFloat(
        listData.filter((item) => item.curtype === e.target.value)[0].value
      )
    );
    console.log(parseFloat(listData.filter((item) => item.curtype === e.target.value)[0].value))
  }
  const d_s = (e) => {
    setX("");
    setY("");
    setA(1);
    setSeld_s(e.target.value);
    console.log(e.target.value)
  };
  const showConvertValue = () => {
    setResult((dcp * curValue) / 100000000);
  };
  const switchSelection = () => {
    if (!dcpflag) {
      getCurrentResult();
    } else {
      setResult(0);
      setDcp(0);
    }
    setDcpflag(!dcpflag);
  };
  const handleX = (e) => {
    if (e.target.value === "") {
      setX("");
      setY("");
    } else {
      if (seld_s === "" || seld_s === "Satosh") {
        setX(e.target.value);
        let y_value;
        if (a === 0) {
          setLast(listData[0].value);
          y_value = parseFloat(
            (parseFloat(e.target.value) * listData[0].value) / 100000000,
            2
          );
        } else
          y_value = parseFloat(
            (parseFloat(e.target.value) * last) / 100000000,
            2
          );
        setY(y_value);
      } else {
        setX(e.target.value);
        let y_value = parseFloat(
          (parseFloat(e.target.value) * dcp * last) / 100000000,
          2
        );
        setY(y_value);
      }
    }
  };
  const handleY = (e) => {
    console.log(last,dcp)
    setY(e.target.value);
    setX((parseFloat(e.target.value) * 100000000) / (last * dcp));
  };
  const changePos = () => {
    setX("");
    setY("");
    setLast(listData[0].value)
    setChgPos(!chgPos);
  };

  return (
    <div className="bg-gradient-to-r from-[#450779] to-[#b6296f] w-screen h-screen items-center ">
      <div className="h-[38px]"></div>
      <div className="w-[69px] h-[73.69px] mt-[38px] ml-[93px]">
        <img src="img/logo.png" alt="animal" className="w-21 md:w-40 lg:w-69"></img>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex flex-row">
          <div className="w-[200px] h-[50px]"></div>
          <p className="mt-[20px] text-white font-medium  text-[44px] leading-[60px] text-7xl tracking-[0.5px] w-[481px] h-[76px]  items-center">
            DCP general converter
          </p>
        </div>
        <div className="mt-[90px]  flex flex-col mt-20px">
          <div className="flex flex-row">
            <div className="w-[183px] h-[41.85px]">
              <p className="text-white tracking-[.410314px] mt-[20px] mr-[15px] leading-[49px] text-[36.1076px] font-medium">
                CONVERT
              </p>
            </div>
            {chgPos ? (
              <div className="flex flex-row justify-center  items-center rounded-[50px] w-[465px] h-[87px] bg-white">
                <select
                  name="cars"
                  id="cars"
                  className="rounded-lg ml-[30px] text-[23.5408px] tracking-[0.267509px] leading-8 hover:bg-sky-700 w-[93px] h-[63px] font-medium text-white bg-[#4e1576]"
                  onChange={d_s}
                >
                  <option id="a" value="Satosh">
                    Sato
                  </option>
                  <option id="a" value="Dcp">
                    Dcp
                  </option>
                </select>
                <input
                  type="text"
                  className="outline-none w-[230px] tracking-[0.556855px] font-normal leading-[67px] text-[49.0032px] ml-[23px] text-black "
                  placeholder="0.00"
                  value={x}
                  onChange={(e) => {
                    if (!isNaN(+e.target.value)) handleX(e);
                  }}
                ></input>
                <img
                  className="w-[25px] h-[41px]"
                  src="img/Vector (3).png"
                  alt="animal"
                ></img>
                <img
                  className="w-[25px] h-[41px]"
                  src="img/Vector (2).png"
                  alt="animal"
                ></img>
              </div>
            ) : (
              <div className="flex flex-row justify-center items-center rounded-[50px] w-[465px] h-[87px] bg-white">
                <select
                  name="cars"
                  id="cars"
                  className="rounded-lg ml-[30px] text-[23.5408px] tracking-[0.267509px] leading-8 hover:bg-sky-700 w-[93px] h-[63px] font-medium text-white bg-[#4e1576]"
                  onChange={showCurrency}
                >
                  {listData.map((menuItem, index) => (
                    <option id="x" key={index} value={menuItem.curtype}>
                      {menuItem.curtype}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="outline-none w-[280px] tracking-[0.556855px] font-normal leading-[67px] text-[49.0032px] ml-[23px] text-black"
                  placeholder="0.00"
                  value={y}
                  onChange={(e) => handleY(e)}
                ></input>
              </div>
            )}
          </div>
          <div
            className="mt-[37px] ml-[143px] flex flex-row"
            onClick={changePos}
          >
            <img
              className="h-[35px] w-[19.69px] "
              src="img/Vector (1).png"
              alt="animal"
            ></img>
            <img
              className="h-[35px] w-[19.69px] "
              src="img/Vector.png"
              alt="animal"
            ></img>
            <div className="w-[55px] h-[42px]  ml-[221.15px]">
              <p className="text-white w-[55px] h-[42px] leading-[49px] tracking-[.410314px] font-medium text-[36.1076px]">
                TO
              </p>
            </div>
          </div>
          <div className="mt-[40px] flex flex-row">
            <div className=" w-[183px] h-[50px] "></div>
            {chgPos ? (
              <div className="flex flex-row justify-center items-center rounded-[50px] w-[465px] h-[87px] bg-white">
                <select
                  name="cars"
                  id="cars"
                  className="rounded-lg ml-[30px] text-[23.5408px] tracking-[0.267509px] leading-8 hover:bg-sky-700 w-[93px] h-[63px] font-medium text-white bg-[#4e1576]"
                  onChange={showCurrency}
                >
                  {listData.map((menuItem, index) => (
                    <option id="x" key={index} value={menuItem.curtype}>
                      {menuItem.curtype}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="outline-none w-[280px] rounded-lg h-16 tracking-[0.556855px] font-normal leading-[67px] text-[49.0032px] ml-[23px] text-black "
                  placeholder="0.00"
                  value={y}
                  onChange={(e) => handleY(e)}
                />
              </div>
            ) : (
              <div className="flex flex-row justify-center items-center rounded-[50px] w-[465px] h-[87px] bg-white">
                <select
                  name="cars"
                  id="cars"
                  className="rounded-lg ml-[30px] text-[23.5408px] tracking-[0.267509px] leading-8 hover:bg-sky-700 w-[93px] h-[63px] font-medium text-white bg-[#4e1576]"
                  onChange={d_s}
                >
                  <option id="a" value="Satosh">
                    Sato
                  </option>
                  <option id="a" value="Dcp">
                    Dcp
                  </option>
                </select>
                <input
                  type="text"
                  className="outline-none w-[230px] tracking-[0.556855px] font-normal leading-[67px] text-[49.0032px] ml-[23px] text-black"
                  placeholder="0.00"
                  value={x}
                  onChange={(e) => {
                    if (!isNaN(+e.target.value)) handleX(e);
                  }}
                ></input>
                <img
                  className="w-[25px] h-[41px]"
                  src="img/Vector (3).png"
                  alt="animal"
                ></img>
                <img
                  className="w-[25px] h-[41px]"
                  src="img/Vector (2).png"
                  alt="animal"
                ></img>
              </div>
            )}
          </div>
          <p className="text-white absolute bottom-[74px] text-3xl">
            Note-Estimates are not exact and are updated about every fifteen
            minutes.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
