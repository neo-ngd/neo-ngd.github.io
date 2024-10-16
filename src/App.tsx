import { useMemo, useState } from "react";
import { Buffer } from "buffer";
import toOpcode from "./utils/toOpcode";
import { u } from "@cityofzion/neon-js";
import { isJSON } from "./utils";

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
    let input = input2;
    if (isJSON(input)) {
      input = JSON.parse(input)?.script ?? "";
    }
    if (u.isHex(input)) {
      input = u.hex2base64(input);
    }
    return toOpcode(input);
  }, [input2]);

  const output3 = useMemo(() => {
    let input = input2;
    if (!input) {
      return "";
    }
    if (isJSON(input)) {
      input = JSON.parse(input)?.script ?? "";
    }
    if (u.isHex(input)) {
      return u.sha256(input).toUpperCase();
    } else {
      return u.sha256(u.base642hex(input)).toUpperCase();
    }
  }, [input2]);

  return (
    <div style={{ padding: "0 20px" }}>
      <h3>Sign message verify</h3>
      <h5>Input:</h5>
      <textarea
        value={input1}
        onChange={(e) => setInput1(e.target.value)}
        style={{ width: "100%", height: "200px" }}
      ></textarea>
      <h5>Output:</h5>
      <div style={{ wordBreak: "break-all" }}>{output1}</div>
      <h3 style={{ marginTop: "50px" }}>Script analysis</h3>
      <h5>Input:</h5>
      <textarea
        value={input2}
        onChange={(e) => setInput2(e.target.value)}
        style={{ width: "100%", height: "200px" }}
      ></textarea>
      <h5>Output(to SHA256):</h5>
      <div style={{ wordBreak: "break-all" }}>{output3}</div>
      <h5>Output(to Smart contract script analysis):</h5>
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
