import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-4xl">✨</span>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-800">
              Konfirmasi Penting!
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Kalau mau hapus background foto, akui dulu <span className="font-bold text-blue-600">bowo ganteng</span>!
              Klik oke untuk akui sekarang
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-200"
            >
              Nggak Deh
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Oke, Bowo Ganteng!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
