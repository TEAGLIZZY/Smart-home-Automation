import React from "react";

function Lights() {
    return (
        <>
            <h1>Lights</h1>
            <div className="room one" id="master">
                <p>Master Bedroom</p>
                <label className="switch">
                    <input type="checkbox" unchecked />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="room two" id="living">
                <p>Living Room</p>
                <label className="switch">
                    <input type="checkbox" unchecked />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="room three" id="entrance">
                <p>Entrance</p>
                <label className="switch">
                    <input type="checkbox" unchecked />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="room four" id="guest">
                <p>Guest Room</p>
                <label className="switch">
                    <input type="checkbox" unchecked />
                    <span className="slider round"></span>
                </label>
            </div>
        </>
    );
};

export default Lights;