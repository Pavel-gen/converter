import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [file, setFile] = useState(null);

  useEffect(() => {
    console.log(file);
  }, [file]);

  const submitHandler = async () => {
    try {
      const url = "http://localhost:5000/";
      let formData = new FormData();
      formData.append("img", file);
      const response = await axios.post(url, formData, {
        method: "post",

        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response);
    } catch (err) {
      console.log({ message: err.message });
    }
  };

  return (
    <div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitHandler();
          }}
        >
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button type="submit">press to send</button>
        </form>
      </div>
    </div>
  );
};

export default App;
