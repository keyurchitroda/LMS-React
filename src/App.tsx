import Router from "./routes";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer position="top-center" />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  );
}

export default App;
