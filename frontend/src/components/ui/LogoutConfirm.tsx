import React from 'react';

type LogoutConfirmType = {
  onClose: () => void;
  proceedAction: () => void;
};

function LogoutConfirm({ onClose, proceedAction }: LogoutConfirmType) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[rgb(135,106,137)] text-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
        <h2 className="text-lg font-semibold text-center mb-4">
          ARE YOU SURE YOU WANT TO LOGOUT?
        </h2>
        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition"
          >
            CANCEL
          </button>
          <button
            onClick={proceedAction}
            className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirm;
