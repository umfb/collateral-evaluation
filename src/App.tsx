import { Route, Routes } from "react-router-dom";
import Form from "./pages/Form";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="" element={<Form />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
