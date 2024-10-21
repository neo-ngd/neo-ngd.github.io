import { useEffect, useMemo, useState } from "react";
import { Buffer } from "buffer";
import toOpcode from "./utils/toOpcode";
import { u } from "@cityofzion/neon-js";
import { isJSON } from "./utils";
import { asTransferScript } from "./utils/format";

window.Buffer = Buffer;

function App() {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [output3, setOutput3] = useState("");

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
    return toOpcode(input)[1];
  }, [input2]);

  const output4 = useMemo(() => {
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

  useEffect(() => {
    const fetchData = async () => {
      let input = input2;
      if (isJSON(input)) {
        input = JSON.parse(input)?.script ?? "";
      }
      if (u.isHex(input)) {
        input = u.hex2base64(input);
      }

      const result = await asTransferScript(toOpcode(input)[0] as any);
      setOutput3(result.join("<br>"));
    };

    fetchData();
  }, [input2]);

  return (
    <div style={{ padding: "20px" }}>
      <h3>Sign message verify</h3>
      <h5>Input:</h5>
      <textarea
        value={input1}
        onChange={(e) => setInput1(e.target.value)}
        style={{ width: "100%", height: "150px" }}
      ></textarea>
      <h5>Output:</h5>
      <div className="output">{output1}</div>
      <h3 style={{ marginTop: "50px" }}>Script analysis</h3>
      <h5>Input:</h5>
      <textarea
        value={input2}
        onChange={(e) => setInput2(e.target.value)}
        style={{ width: "100%", height: "150px" }}
      ></textarea>
      <h5>Output(to SHA256):</h5>
      <div className="output">{output4}</div>
      <h5>Output(to simple transfer script):</h5>
      <div
        className="output"
        dangerouslySetInnerHTML={{
          __html: output3 as any,
        }}
      ></div>
      <h5>Output(to Smart contract script analysis):</h5>
      <div
        className="output"
        dangerouslySetInnerHTML={{
          __html: output2 as any,
        }}
      ></div>
    </div>
  );
}

export default App;
