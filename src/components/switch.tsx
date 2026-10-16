export default function Switch({ checked = true, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative flex h-7 w-13 cursor-pointer rounded-full p-0.5 ease-in-out focus:outline-none ${
        checked ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`pointer-events-none h-6 w-6 transform rounded-full bg-white shadow ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}