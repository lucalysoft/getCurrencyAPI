import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [dcp, setDcp] = useState(0.0);
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
    let tmp = parseFloat(listData.filter((item) => item.curtype === e.target.value)[0].value).toFixed(4);
    setA(1);
    setLast(tmp);
    if (!chgPos) {
      if (y !== "") setX(parseFloat(y / dcp * 100000000 / tmp).toFixed(4));
      else {
        setY("");
      }
    }
    else {
      setY(parseFloat(x * dcp * tmp / 100000000).toFixed(4));
    }


  }
  const d_s = (e) => {
    // setX("");
    // setY("");
    // setA(1);
    // setSeld_s("DCP");
    // console.log(e.target.value)
  };
  const handleX = (e) => {
    if (chgPos) {
      if (e.target.value === "") {
        setX("");
        setY("");
      }
      else {
        setX(e.target.value);
        let y_value;
        if (a === 0) {
          setLast(listData[0].value);
          y_value = parseFloat((parseFloat(e.target.value) * dcp * listData[0].value) / 100000000).toFixed(4);
        }
        else y_value = parseFloat((parseFloat(e.target.value) * dcp * last) / 100000000).toFixed(4);
        setY(y_value);
      }
    }

  };
  const handleY = (e) => {
    if (!chgPos) {
      if (e.target.value === "") {
        setX("");
        setY("");
      }
      else {
        setY(e.target.value);
        setX(parseFloat((parseFloat(e.target.value) * 100000000) / (last * dcp)).toFixed(4));
      }
    }

  };
  const changePos = () => {
    setX("");
    setY("");
    setLast(listData[0].value.toFixed(4))
    setChgPos(!chgPos);
  };
  const initial = () => {
    getCurrentResult();
    setX("");
    setY("");
    setChgPos(true);

  }
  return (
    <div className="bg-gradient-to-r from-[#450779]  to-[#b6296f] w-screen h-[100vh] items-center min-w-[450px]">
      <div className="h-[38px]"></div>
      <div className="md:w-[69px] md:h-[73.69px] md:mt-[38px] ml-[10px] md:ml-[93px] cursor-pointer" onClick={initial} >
        <img src="img/logo.png" alt="animal" className="w-21 md:w-40 lg:w-69"></img>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex flex-row justify-center items-center">
          <div className=" md:w-[200px] md:h-[50px]"></div>
          <p className=" text-white font-medium  mx-auto text-[30px] md:text-[44px] leading-[60px] text-7xl tracking-[0.5px] w-[481px] h-[76px]  items-center">
            DCP general converter
          </p>
        </div>
        <div className="mt-[20px] md:mt-[90px]  flex flex-col mt-20px">
          <div className=" justify-center items-start md:items-center flex flex-col  md:flex-row">
            <div className="items-start md:w-[183px] md:h-[41.85px]">
              <p className="text-white tracking-[.410314px] mb-[5px] md:mb-[1px] md:mr-[15px] leading-[49px] text-[xl] md:text-[36.1076px] font-medium">
                CONVERT
              </p>
            </div>
            {chgPos ? (
              <div className="shadow-md flex flex-row justify-center  items-center rounded-[50px] w-[465px] h-[87px] bg-white">
                <button className=" cursor-pointer rounded-[14px] ml-[20px] text-[23.5408px] tracking-[0.267509px] leading-8 hover:bg-sky-700 w-[73px] h-[63px] font-medium text-white bg-[#4e1576]"
                  onClick={d_s}>DCP</button>
                <input
                  type="text"
                  className="outline-none w-4/5 md:w-[300px] tracking-[0.556855px] font-normal leading-[67px] text-[49.0032px] ml-[23px] text-black "
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
              <div className="shadow-md flex flex-row justify-start items-center rounded-[50px] w-[465px] h-[87px] bg-white">
              <select
                name="cars"
                id="cars"
                className=" cursor-pointer rounded-[14px] ml-[20px] text-[23.5408px] tracking-[0.267509px] leading-8 hover:bg-sky-700 w-[73px] h-[63px] font-medium text-white bg-[#4e1576]"
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
                className="outline-none w-[305px] rounded-lg h-16 tracking-[0.556855px] font-normal leading-[67px] text-[49.0032px] ml-[23px] text-black "
                placeholder="0.00"
                value={y}
                onChange={(e) => handleY(e)}
              />
            </div>
            )}
          </div>
          <div
            className="mt-[37px] ml-[143px] flex flex-row  "
            
          >
            <img
              className="h-[35px] w-[19.69px] cursor-pointer"
              src="img/Vector (1).png"
              alt="animal"
              onClick={changePos}
            ></img>
            <img
              className="h-[35px] w-[19.69px] cursor-pointer"
              src="img/Vector.png"
              alt="animal"
              onClick={changePos}
            ></img>
            <div className="w-[55px] h-[42px]  ml-[20px] md:ml-[221.15px]">
              <p className="text-white w-[55px] h-[42px] leading-[49px] tracking-[.410314px] font-medium text-[xl] md:text-[36.1076px]">
                TO
              </p>
            </div>
          </div>
          <div className="mt-[40px] flex flex-row">
            <div className=" w-[5px] md:w-[183px] md:h-[50px] "></div>
            {chgPos ? (
              <div className="shadow-md flex flex-row justify-start items-center rounded-[50px] w-[465px] h-[87px] bg-white">
              <select
                name="cars"
                id="cars"
                className=" cursor-pointer rounded-[14px] ml-[20px] text-[23.5408px] tracking-[0.267509px] leading-8 hover:bg-sky-700 w-[73px] h-[63px] font-medium text-white bg-[#4e1576]"
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
                className="outline-none w-[305px] rounded-lg h-16 tracking-[0.556855px] font-normal leading-[67px] text-[49.0032px] ml-[23px] text-black "
                placeholder="0.00"
                value={y}
                onChange={(e) => handleY(e)}
              />
            </div>
            ) : (
              <div className="shadow-md flex flex-row justify-center items-center rounded-[50px] w-[465px] h-[87px] bg-white">
                <button className="rounded-[14px] ml-[20px] text-[23.5408px] tracking-[0.267509px] leading-8 hover:bg-sky-700 w-[120px] h-[63px] font-medium text-white bg-[#4e1576]"
                  onClick={d_s}>DCP</button>
                <input
                  type="text"
                  className="outline-none w-[300px] tracking-[0.556855px] font-normal leading-[67px] text-[49.0032px] ml-[23px] text-black"
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
        </div>
          <p className="tracking-tighter text-white absolute  mt-[559px] mb-[74px] text-xl mr-[30px] ml-[30px] md:text-3xl justify-center  items-center">
            Note- Estimates are not exact and are updated about every fifteen minutes.
          </p> 
      </div>
    </div>
  );
}

export default App;
