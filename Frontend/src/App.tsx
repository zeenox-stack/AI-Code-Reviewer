import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/appRoutes"; 
import { createContext, useState } from "react";
import Loader from "./Components/Loader";

export interface LoaderContextType {
  load: boolean; 
  setLoad: (val: boolean) => void;
}

export const LoaderContext = createContext<LoaderContextType | null>(null);

function App() {
  const [load, setLoad] = useState<boolean>(false);
  return (
    <LoaderContext.Provider value={{ load, setLoad }}>
      {load && <Loader />}
      <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    </LoaderContext.Provider>
  );
}

export default App;
