import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import AboutScreen from "./pages/AboutScreen";
import HomeScreen from "./pages/HomeScreen"
import YearlyLifetimeMembershipForm from "./forms/YearlyLifetimeMembershipForm";
function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/about" element={<AboutScreen />} />
          <Route path="/YearlyLifetimeMembershipForm" element={<YearlyLifetimeMembershipForm />}/>
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
