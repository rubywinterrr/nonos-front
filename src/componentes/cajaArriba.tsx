export default function Header() {
  return (
    <>
      <header className="bg-blue-300 h-[10vh] w-screen flex items-center">
        <div className="h-1/1 w-[40%] flex items-center pl-1.5">
          <div className="aspect-square border h-85/100 rounded-full flex justify-center items-center">1</div>
        </div>
        <div className="h-1/1 w-[60%] flex items-center justify-end">
          <div className="aspect-square border h-85/100 mr-6 flex justify-center items-center">2</div>
          <div className="aspect-square border h-85/100 mr-1.5 flex justify-center items-center">3</div>
        </div>
      </header>
    </>
  );
}
