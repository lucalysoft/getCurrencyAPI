import React, { useState,useEffect } from 'react';
import './App.css';
import axios from 'axios'

function App() {
  const [dcp, setDcp] = useState(0.0); 
  const [result, setResult] = useState(0.0);  
  const [curValue, setCurValue] = useState(0.0); 
  const [dcpflag, setDcpflag] = useState(false);
  const [listData, setListData] = useState([]); 
  const [x, setX] = useState(""); 
  const [y, setY] = useState(""); 
  const [a, setA] = useState(0); 
  const [last, setLast] = useState(0.0); 
  const [seld_s, setSeld_s] = useState("");
  useEffect(() => {
    getCurrentResult();
  }, []);
  
  
  const getDCP = () => new Promise((resolve, reject) => {
    axios.get('https://metrics.router.democraticcooperative.cash/metrics/last')
      .then((response) => {
        let text = ""
        for (const x in response.data) {
          text += response.data[x] + ", ";
        }
        setDcp(parseFloat(text));
        resolve(1);
      })
      .catch((err) => {
        console.error('Error:', err);
        reject(err);
      });
  })
  
  const getTicker = () => new Promise((resolve, reject) => {
    axios.get('https://blockchain.info/ticker')
    .then(response => {
      for (const x in response.data) {
        let row={
          curtype :x,
          value : parseFloat(response.data[x].last)
        }
        setListData(listData => [...listData, row]);
      }
      resolve(1);
    }).catch(e => reject(e));
  })
  const getCurrentResult = async () => {
    await getDCP();
    await getTicker();
    
    // if(listData.length>0)setCurValue(listData[0].value);
    // else setCurValue(0)
  }
  function showCurrency(e){
    // setCurValue(listData.filter(item => item.curtype === e.target.value)[0].value);    
    setX("");
    setY("");
    setA(1)
    setLast(parseFloat(listData.filter(item => item.curtype === e.target.value)[0].value));
  }
  const d_s = (e) => {
    // console.log(e.target.value)
    setX("");
    setY("");
    setA(1);
    setSeld_s(e.target.value);
  }
  const showConvertValue = () =>{
    setResult(dcp*curValue/100000000);
  }
  const switchSelection = () =>{
    if(!dcpflag){
      getCurrentResult();
    }
    else{
      setResult(0);
      setDcp(0)
    }
    setDcpflag(!dcpflag);

  }
  const handleX = (e) =>{
    if(e.target.value==""){
      setX("");
      setY("");
    }
    else {
      if(seld_s==""||seld_s=="Satosh"){
        setX(e.target.value);
        let y_value;
        if(a==0){
          setLast(listData[0].value);
          y_value = parseFloat(parseFloat(e.target.value)*(listData[0].value)/100000000,2);
        }
        else y_value = parseFloat(parseFloat(e.target.value)*last/100000000,2);
        setY(y_value);
      }
      else{
        setX(e.target.value);
        let y_value = parseFloat(parseFloat(e.target.value)*dcp*last/100000000,2);
        setY(y_value);
      }      
    }    
  }
  const handleY = (e) =>{
    // setY(e.target.value)
    // setY(parseFloat(e.target.value)*curValue/100000000)
  }
  
  return (
        <div className='bg-black w-screen h-screen items-center'>
          <div className='flex flex-col items-center'>
          <p className='text-white font-black text-7xl  mt-56 items-center'>Facinating converter</p>
            <div className='mt-12  flex flex-col mt-20px'>
              <p className='mt-12  text-white text-3xl'>              
                <select name="cars" id="cars" className="rounded-xl hover:bg-sky-700 w-28 h-16 bg-indigo-500" onChange={d_s}>
                  <option id="a" value = "Satosh">Satosh</option>
                  <option id="a" value = "Dcp">Dcp</option>
                </select>
                <input type="text" className="rounded-lg text-right pr-4 text-3xl h-16 font-semibold bg-slate-700 text-white w-96 " placeholder="0" value={x} onChange={(e) =>{if(!isNaN(+e.target.value))handleX(e)} }></input>
                {/* {!dcpflag?(<input type="text" className="rounded-lg text-center text-3xl h-16 font-semibold bg-slate-700 text-white w-96" value={dcp} onChange={(e) => setDcp(e.target.value)}></input>):(<input type="text" className=" rounded-lg w-96 text-right font-semibold bg-slate-700 text-3xl h-16 " value={dcp}></input>)} */}
              </p>
              
              <p className='mt-12 text-white text-3xl'>
                <select name="cars" id="cars" className=" rounded-xl hover:bg-sky-700 w-28 h-16 bg-indigo-500" onChange={showCurrency}> 
                            {listData.map((menuItem, index) => (
                              <option id="x" key={index} value={menuItem.curtype}>{menuItem.curtype}</option>
                            ))}
                          </select> 
                {/* <span>{curValue}</span>  */}
                <input type="text" className="inline-block rounded-lg h-16 text-right bg-slate-700 pr-4 text-white w-96" placeholder="0.00"  value={y} onChange={(e) => handleY(e)}></input>         
              </p>  
              
            </div>
            <div className='mt-12 flex flex-row'>
              {/* <button className="bg-indigo-500 text-center hover:bg-sky-700 font-semibold rounded-lg text-3xl text-white " onClick={switchSelection}>switch selection</button> 
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; */}
              {/* <button className="bg-indigo-500  text-center rounded-lg font-semibold hover:bg-sky-700 shadow-slate-100 w-36 h-16 text-3xl text-white " onClick={showConvertValue}>convert</button>  
              <button  className="bg-indigo-500"></button> */}
              <img width="60" height="40" src="updown.png" className='rounded-lg hover:bg-white mb-40' alt="animal"></img>
            </div>
            
            {/* <p className='text-white mt-3 text-3xl'>
              Current DCP is:&nbsp; &nbsp;{result}
            </p> */}
            <p className='text-white absolute bottom-0 text-3xl'>Copyright(2023): This software will be secured by authors.</p>
          </div>
        </div>
     
  );
}

export default App;


