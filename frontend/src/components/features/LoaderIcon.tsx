import React from "react";

export default function Spinner() {
  return (

     <div className=" fixed inset-0 z-50   flex justify-center items-center bg-transparent ">
      <div className=" w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>
 
  );
}
