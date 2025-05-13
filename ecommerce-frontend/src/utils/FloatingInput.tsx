const FloatingInput = ({ label, type = "text", value, onChange }) => (
<div className="relative w-full">
  <input
    type={type}
    placeholder=" "
    value={value}
    onChange={onChange}
    className="peer w-full border border-gray-300 text-gray-900 bg-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 pt-6 pb-2 rounded-xl text-base"
  />
  <label
    className="absolute left-4 top-2 text-gray-500 bg-white px-1 transition-all duration-200
               peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
               peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600
               peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-sm"
  >
    {label}
  </label>
</div>

);

export default FloatingInput;