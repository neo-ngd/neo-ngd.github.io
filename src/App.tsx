import { useMemo, useState } from "react";
import { Buffer } from "buffer";
import toOpcode from "./utils";
import { u } from "@cityofzion/neon-js";

window.Buffer = Buffer;

function App() {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");

  const output1 = useMemo(() => {
    if (!input1) {
      return "";
    }
    return u.sha256(Buffer.from(input1).toString("hex"));
  }, [input1]);

  const output2 = useMemo(() => {
    return toOpcode(input2);
  }, [input2]);

  const output3 = useMemo(() => {
    return u.sha256(input3).toUpperCase();
  }, [input3]);

  return (
    <div style={{ padding: "0 20px" }}>
      <h3>Sign message verify</h3>
      <div>Input:</div>
      <textarea
        value={input1}
        onChange={(e) => setInput1(e.target.value)}
        style={{ width: "100%", height: "200px" }}
      ></textarea>
      <div>Output:</div>
      <div style={{ wordBreak: "break-all" }}>{output1}</div>
      <h3 style={{ marginTop: "50px" }}>Script analysis</h3>
      <div>Input:</div>
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
      <h3 style={{ marginTop: "50px" }}>SHA256</h3>
      <div>Input:</div>
      <textarea
        value={input3}
        onChange={(e) => setInput3(e.target.value)}
        style={{ width: "100%", height: "200px" }}
      ></textarea>
      <div>Output:</div>
      <div style={{ wordBreak: "break-all" }}>{output3}</div>
    </div>
  );
}

export default App;
