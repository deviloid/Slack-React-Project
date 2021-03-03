import './App.css';
import { SideBar } from "./components/Sidebar/SideBar.component";
import Messages from "./components/Messages/Messages.component";

function App() {
  return (
    <>
      <div id='parent'>
        <div id='sidebar'>
          <SideBar />
        </div>
        <div id='messages'>
          <Messages />
        </div>
      </div>
    </>
  );
}

export default App;
