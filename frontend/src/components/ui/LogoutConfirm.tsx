import React from 'react'
import Modal from '../features/Modal'
type logoutConfirmType = {
    onConfirm :  ()=>void
    onCancel : ()=>void
}
function LogoutConfirm({onCancel,onConfirm}:logoutConfirmType) {
    

  return (
    <Modal title="Confirm" onClose={onCancel}>
   <div className='h-full w-fit'>
   <p className="mb-6 text-center text-gray-700">Are you sure you want to continue?</p>
    <div className="flex justify-center gap-4">
      <button
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold"
        onClick={onConfirm}
      >
        ✓
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-semibold"
        onClick={onCancel}
      >
        ✕
      </button>
    </div>
   </div>
  </Modal>
  )
}

export default LogoutConfirm