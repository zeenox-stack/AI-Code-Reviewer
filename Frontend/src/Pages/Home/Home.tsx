import React from "react";
import Header from "../../Features/Home/Features/Header/Header";
import Body from "../../Features/Home/Features/Body/Body";
import Footer from "../../Features/Home/Features/Footer/Footer";

const Home: React.FC = React.memo(() => {
  return (
    <>
      <Header />
      <Body />
      <Footer />
    </>
  );
});

export default Home;
