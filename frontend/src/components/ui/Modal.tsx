import type { ReactElement } from "react";
import ReactDOM from "react-dom"

type modalProps = {
  title:string,
  children:ReactElement,
  onClose:()=>void
}
export default function Modal({ title, children, onClose }:modalProps) {
  return ReactDOM.createPortal(
    <div className="position absolute   inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded shadow-xl relative animate-fade-in p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
}
