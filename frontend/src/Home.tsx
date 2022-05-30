import { useEffect } from "react";

const Home: React.FC = () => {
  const testFunction = async () => {
    const res = await fetch("http://localhost:8080/v1/test");

    console.log(res);
  };

  useEffect(() => {
    testFunction();
  }, []);
  return <div>Hello World</div>;
};

export default Home;
