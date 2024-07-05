import React from "react";
import logo from "../assets/logo.png";

function Loading({height, width, loadingHeight, loadingWidth}) {
  return (
    <div className="flex justify-center items-center">
      <div className={`absolute animate-custom-spin rounded-full h-${loadingHeight} w-${loadingWidth} border-t-4 border-b-4 border-t-cirlce`}></div>
      <img src={logo} alt="Logo" className={`h-${height} w-${width}`}/>
    </div>
  );
}

export default Loading;
