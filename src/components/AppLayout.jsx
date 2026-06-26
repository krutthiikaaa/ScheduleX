import TopNav from "./TopNav";
import BottomDock from "./BottomDock";

function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <TopNav />
      <main className="app-main">{children}</main>
      <BottomDock />
    </div>
  );
}

export default AppLayout;
