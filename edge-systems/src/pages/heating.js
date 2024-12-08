import React, { useState} from "react";

function Heating() {

    // must use let instead of const, if not it won't -/+
    let [count, setCount] = useState(15);   // initialise count as 15

    function increase() {
        count = count+1;
        if(count>25) {  // max temp for heating
            count=25;
        }
        setCount(count);
    }

    function decrease() {
        count = count-1;
        if(count<15) {  // min temp for heating
            count=15;
        }
        setCount(count);
    }

    // NEED TO CHANGE. this is just hard coding to make it work for now.
    // and there has got to be a better way to do this
    let [count2, setCount2] = useState(15);   // initialise count as 15
    function increase2() {
        count2 = count2+1;
        if(count2>25) {  // max temp for heating
            count2=25;
        }
        setCount2(count2);
    }
    function decrease2() {
        count2 = count2-1;
        if(count2<15) {  // min temp for heating
            count2=15;
        }
        setCount2(count2);
    }
    let [count3, setCount3] = useState(15);   // initialise count as 15
    function increase3() {
        count3 = count3+1;
        if(count3>25) {  // max temp for heating
            count3=25;
        }
        setCount3(count3);
    }
    function decrease3() {
        count3 = count3-1;
        if(count3<15) {  // min temp for heating
            count3=15;
        }
        setCount3(count3);
    }
    let [count4, setCount4] = useState(15);   // initialise count as 15
    function increase4() {
        count4 = count4+1;
        if(count4>25) {  // max temp for heating
            count4=25;
        }
        setCount4(count4);
    }
    function decrease4() {
        count4 = count4-1;
        if(count4<15) {  // min temp for heating
            count4=15;
        }
        setCount4(count4);
    }
    
    return (
        <>
            <h1>Heating</h1>
            <div className="room one" id="master">
                <p>Master Bedroom</p>
                <div className="wrapper" id="control-1">
                    <button className="minus" onClick={decrease}>-</button>
                    <div className="num">{count}</div>
                    <button className="minus" onClick={increase}>+</button>
                </div>
            </div>
            <div className="room two" id="living">
                <p>Living Room</p>
                <div className="wrapper" id="control-2">
                    <button className="minus" onClick={decrease2}>-</button>
                    <div className="num">{count2}</div>
                    <button className="minus" onClick={increase2}>+</button>
                </div>
            </div>
            <div className="room three" id="entrance">
                <p>Entrance</p>
                <div className="wrapper" id="control-3">
                    <button className="minus" onClick={decrease3}>-</button>
                    <div className="num">{count3}</div>
                    <button className="minus" onClick={increase3}>+</button>
                </div>
            </div>
            <div className="room four" id="guest">
                <p>Guest Room</p>
                <div className="wrapper" id="control-4">
                    <button className="minus" onClick={decrease4}>-</button>
                    <div className="num">{count4}</div>
                    <button className="minus" onClick={increase4}>+</button>
                </div>
            </div>
        </>
    );
};

export default Heating;