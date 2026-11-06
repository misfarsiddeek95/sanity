import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default [...nextVitals, ...nextTs, { rules: { "react/no-unescaped-entities": "off" } }, { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] }];
