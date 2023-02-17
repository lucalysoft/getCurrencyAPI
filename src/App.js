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
  }
  const d_s = (e) => {
    setX("");
    setY("");
    setA(1);
    setSeld_s(e.target.value);
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
    setY(e.target.value);

    console.log(last);

    setX(parseFloat(e.target.value)*100000000/(last*dcp));








  };
  const changePos = () =>{
    setX("");
    setY("");
    setChgPos(!chgPos);
  }

  return (
    <div className="bg-black w-screen h-screen items-center">
      <div className="flex flex-col items-center">
        <p className="text-white font-black text-7xl  mt-56 items-center">
          Facinating converter
        </p>
        <div className="mt-12  flex flex-col mt-20px">
          {chgPos?(<div className="rounded-3xl w-[560px] h-[79px] bg-white">
            <select
              name="cars"
              id="cars"
              className="ml-2 mt-2 rounded-lg hover:bg-sky-700 w-28 h-16 bg-indigo-500"
              onChange={d_s}
            >
              <option id="a" value="Satosh">
                Satosh
              </option>
              <option id="a" value="Dcp">
                Dcp
              </option>
            </select>
            <input
              type="text"
              className=" outline-none text-right pr-4 text-3xl h-16 font-semibold text-black w-96 "
              placeholder="0"
              value={x}
              onChange={(e) => {
                if (!isNaN(+e.target.value)) handleX(e);
              }}
            ></input>
          </div>):(
            <div className="rounded-3xl w-[560px] h-[79px] bg-white">
            <select
              name="cars"
              id="cars"
              className="ml-2 mt-2 rounded-lg hover:bg-sky-700 w-28 h-16 bg-indigo-500"
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
              className="outline-none rounded-lg h-16 text-right pr-4 text-black w-96"
              placeholder="0.00"
              value={y}
              onChange={(e) => handleY(e)}
            ></input>
            </div>
     
          )}
          <div className="mt-12 flex flex-row" onClick={changePos}>
          <img
            width="60"
            height="40"
            src="updown.png"
            alt="animal"
          ></img>
          <p className="text-white">TO</p>
        </div>
        {chgPos?(
        <div className="rounded-3xl w-[560px] h-[79px] bg-white">
            <select
              name="cars"
              id="cars"
              className="ml-2 mt-2 rounded-lg hover:bg-sky-700 w-28 h-16 bg-indigo-500"
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
              className="outline-none rounded-lg h-16 text-right pr-4 text-black w-96"
              placeholder="0.00"
              value={y}
              onChange={(e) => handleY(e)}/>
            </div>
        
        ):(<div className="rounded-3xl w-[560px] h-[79px] bg-white">
        <select
          name="cars"
          id="cars"
          className="ml-2 mt-2 rounded-lg hover:bg-sky-700 w-28 h-16 bg-indigo-500"
          onChange={d_s}
        >
          <option id="a" value="Satosh">
            Satosh
          </option>
          <option id="a" value="Dcp">
            Dcp
          </option>
        </select>
        <input
          type="text"
          className=" outline-none text-right pr-4 text-3xl h-16 font-semibold text-black w-96 "
          placeholder="0"
          value={x}
          onChange={(e) => {
            if (!isNaN(+e.target.value)) handleX(e);
          }}
        ></input>
      </div>
            
     
          )}
        

        <p className="text-white absolute bottom-0 text-3xl">
          Copyright(2023): This software will be secured by authors.
        </p>
      </div>
    </div></div>
  );
}

export default App;
