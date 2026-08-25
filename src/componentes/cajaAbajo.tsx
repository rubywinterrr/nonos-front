export default function Footer() {
  return (
    <>
      <footer className="bg-blue-300 h-[10vh] w-screen fixed bottom-0 grid grid-cols-4 justify-items-stretch items-end gap-1.5">
        <div className="h-90/100 border rounded-t-lg hover:scale-y-120 transition-all">1</div>
        <div className="h-90/100 border rounded-t-lg hover:scale-y-120 transition-all">2</div>
        <div className="h-90/100 border rounded-t-lg hover:scale-y-120 transition-all" >3</div>
        <div className="h-90/100 border rounded-t-lg hover:scale-y-120 transition-all">4</div>
      </footer>
    </>
  );
}
