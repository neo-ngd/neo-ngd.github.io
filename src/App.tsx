import { useMemo, useState } from "react";
import { Buffer } from "buffer";
import toOpcode from "./utils";
import { u } from "@cityofzion/neon-js";

window.Buffer = Buffer;

function App() {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");

  const output1 = useMemo(() => {
    if (!input1) {
      return "";
    }
    return u.sha256(Buffer.from(input1).toString("hex"));
  }, [input1]);

  const output2 = useMemo(() => {
    return toOpcode(input2);
  }, [input2]);

  return (
    <div style={{ padding: "20px" }}>
      <div>Input:</div>
      <textarea
        value={input1}
        onChange={(e) => setInput1(e.target.value)}
        style={{ width: "100%", height: "200px" }}
      ></textarea>
      <div>Output:</div>
      <div style={{ wordBreak: "break-all" }}>{output1}</div>
      <div style={{ marginTop: "50px" }}>Input:</div>
      <textarea
        value={input2}
        onChange={(e) => setInput2(e.target.value)}
        style={{ width: "100%", height: "200px" }}
      ></textarea>
      <div>Output:</div>
      <div
        style={{ wordBreak: "break-all" }}
        dangerouslySetInnerHTML={{
          __html: output2 as any,
        }}
      ></div>
    </div>
  );
}

export default App;
