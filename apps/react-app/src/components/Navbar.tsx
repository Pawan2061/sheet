export default function Navbar() {
  return (
    <nav className="p-5 flex justify-between">
      <div className="text-2xl font-semibold">tipTion</div>
      <div>
        <button className="text-[#777672] text-sm px-1 rounded-md duration-0 hover:bg-gray-200  py-2">
          Login
        </button>
      </div>
    </nav>
  );
}
