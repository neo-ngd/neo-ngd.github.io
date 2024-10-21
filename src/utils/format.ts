import BigNumber from "bignumber.js";
import { u, wallet } from "@cityofzion/neon-js";
import { post } from "./index";

export async function asTransferScript(input: string[]): Promise<string[]> {
  const transferTemplates = [
    "PUSHT|PUSHNULL",
    "PUSH(?:1[0-6]|[1-9])|PUSHINT(?:8|16|32|64|128|256) \\d+",
    "PUSHDATA1 0x[0-9a-f]{40}",
    "PUSHDATA1 0x[0-9a-f]{40}",
    "PUSH4",
    "PACK",
    "PUSH15",
    "PUSHDATA1 transfer",
    "PUSHDATA1 0x[0-9a-f]{40}",
    "SYSCALL System.Contract.Call",
  ];

  if (input.length !== transferTemplates.length) return [];

  const isInputValid = input.every((value, index) => {
    const regex = new RegExp(transferTemplates[index]);
    return value === transferTemplates[index] || regex.test(value);
  });

  if (!isInputValid) return [];

  const amountStr = input[1].startsWith("PUSHINT")
    ? input[1].split(" ")[1]
    : input[1].replace("PUSH", "");
  const amount = new BigNumber(amountStr);

  const contract = input[8].split(" ")[1];

  const processNetwork = async (net: string): Promise<string[] | null> => {
    try {
      const decimalsRes = await await post(
        net,
        JSON.stringify({
          params: [contract, "decimals"],
          method: "invokefunction",
          jsonrpc: "2.0",
          id: 1,
        })
      );
      const symbolRes = await post(
        net,
        JSON.stringify({
          params: [contract, "symbol"],
          method: "invokefunction",
          jsonrpc: "2.0",
          id: 1,
        })
      );
      const trueAmount = new BigNumber(amount).shiftedBy(
        -decimalsRes.result.stack[0].value
      );

      const fromAddress = wallet.getAddressFromScriptHash(
        u.remove0xPrefix(input[3].split(" ")[1])
      );
      const toAddress = wallet.getAddressFromScriptHash(
        u.remove0xPrefix(input[2].split(" ")[1])
      );

      const result: string[] = [
        `Transfer ${trueAmount} ${u.base642utf8(
          symbolRes.result.stack[0].value
        )} from ${fromAddress} to ${toAddress}`,
      ];

      const nativeContractsRes = await post(
        net,
        JSON.stringify({
          params: [],
          method: "getnativecontracts",
          jsonrpc: "2.0",
          id: 1,
        })
      );
      const nativeContract = nativeContractsRes.result.find(
        (p: any) => p.hash === contract
      );
      if (!nativeContract) {
        result.push(`Token: ${input[8].split(" ")[1]}`);
        result.push(
          `Network: ${
            net === "https://rpc.t5.n3.nspcc.ru:20331" ? "TestT5" : "MainNet"
          }`
        );
      }

      try {
        const toContract = await post(
          net,
          JSON.stringify({
            jsonrpc: "2.0",
            method: "getcontractstate",
            params: [input[2].split(" ")[1]],
            id: 1,
          })
        );
        if (toContract.result) {
          result.push(`Note: ${toAddress} is a contract.`);
        }
      } catch (err) {
        console.log(err);
      }

      return result;
    } catch (error) {
      return null;
    }
  };

  // 遍历网络选项，寻找第一个成功处理的网络
  const clientOptions = [
    "https://rpc.t5.n3.nspcc.ru:20331",
    "https://n3seed1.ngd.network:10332",
  ];
  for (const net of clientOptions) {
    const result = await processNetwork(net);
    if (result) return result;
  }

  // 如果所有网络都处理失败，返回空数组
  return [];
}
