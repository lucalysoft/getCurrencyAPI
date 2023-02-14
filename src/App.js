import React, { useState,useEffect } from 'react';
import './App.css';
import axios from 'axios'

function App() {
  const [dcp, setDcp] = useState(0.0); 
  const [last, setLast] = useState(0.0);
  const [result, setResult] = useState(0.0);  
  const [curData, setCurData] = useState([]); 
  const [curValue, setCurValue] = useState(0.0); 
  const currencyType = ["usd","busd"]
  useEffect(() => {
    getCurrentResult();
    // setCurValue(listData[0].value)
  }, []);
  const [listData, setListData] = useState([]); 
  
  const getDCP = () => new Promise((resolve, reject) => {
    axios.get('https://metrics.router.democraticcooperative.cash/metrics/last')
      .then((response) => {
        let text = ""
        for (const x in response.data) {
          text += response.data[x] + ", ";
        }
        setDcp(parseFloat(text));
        console.log(parseFloat(text))
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
  }
  function showCurrency(e){
    setCurValue(listData.filter(item => item.curtype === e.target.value)[0].value);
    console.log(listData[0].value)
  }
  const showConvertValue = () =>{
    setResult(dcp*curValue/100000000);
  }
  
  const switchSelection = () =>{
    setResult(0);
  }
  return (
        <div className=' w-full h-full justify-center items-center'>
          <div className='flex flex-col'>
            <div className='flex flex-row mt-20px space-x-5'>
              <p>              
                DCP:&nbsp; &nbsp;{dcp}          
              </p>              
              <p>
                ConvertTo:&nbsp; &nbsp;<select name="cars" id="cars" onChange={showCurrency}> 
                            {listData.map((menuItem, index) => (
                              <option id="x" key={index} value={menuItem.curtype}>{menuItem.curtype}</option>
                            ))}
                          </select> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <span>{curValue}</span>          
              </p>  
              
            </div>
            <div className='flex flex-row mt-3'>
              <button className="bg-indigo-500 opacity-100 ..." onClick={switchSelection}>switch selection</button> 
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              <button className="bg-indigo-500 opacity-100 ..." onClick={showConvertValue}>convert</button>   
            </div>
            
            <p className=' mt-3'>
              Current DCP is:&nbsp; &nbsp;{result}
            </p>
          </div>
        </div>
     
  );
}

export default App;
