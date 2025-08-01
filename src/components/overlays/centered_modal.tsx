/**
 * Renders a centered modal component.
 *
 * @param {boolean} open - Whether the modal is open or not.
 * @param {() => void} onClose - Function to close the modal.
 * @param {React.ReactNode} children - The content of the modal.
 * @returns {React.ReactElement} The rendered centered modal component.
 */
export const CenteredModal = ({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }): React.ReactElement => {
  return (
    // backdrop
    <div
      onClick={onClose}
      className={`
        fixed inset-0 flex justify-center items-center transition-colors
        ${open ? "visible bg-black/20" : "invisible"}
      `}
    >
      {/* modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-white rounded-xl shadow p-6 transition-all
          ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
        >
          x
        </button>
        {children}
      </div>
    </div>
  )
}