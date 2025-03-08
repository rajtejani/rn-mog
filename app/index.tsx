import { NavigationIndependentTree } from "@react-navigation/native";
import App from "./App";
import "./index.scss";
export const Index = () => {
  return (
    <>
      <NavigationIndependentTree>
        <App />
      </NavigationIndependentTree>
    </>
  );
};

export default Index;
