import { useMemo, useState } from "react";
import { u } from "@cityofzion/neon-js";
import { Buffer } from "buffer";
import toOpcode from "./utils";

window.Buffer = Buffer;

function App() {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");

  const output1 = useMemo(() => {
    return Buffer.from(input1).toString("hex");
  }, [input1]);

  const output2 = useMemo(() => {
    return toOpcode(input2);
  }, [input2]);

  return (
    <div>
      <div>Input:</div>
      <textarea
        value={input1}
        onChange={(e) => setInput1(e.target.value)}
        style={{ width: "80%", height: "200px" }}
      ></textarea>
      <div>Output:</div>
      <div>{output1}</div>
      <div>Input:</div>
      <textarea
        value={input2}
        onChange={(e) => setInput2(e.target.value)}
        style={{ width: "80%", height: "200px" }}
      ></textarea>
      <div>Output:</div>
      <div
        dangerouslySetInnerHTML={{
          __html: output2 as any,
        }}
      ></div>
    </div>
  );
}

export default App;
