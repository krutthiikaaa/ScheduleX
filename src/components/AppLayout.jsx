import Sidebar from "./Sidebar";

function AppLayout({ children }) {

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="main-topbar" style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', alignItems: 'center', position: 'relative' }}>

          <div className="topbar-actions">
            <div className="user-avatar" style={{ cursor: "pointer" }}>JD</div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
