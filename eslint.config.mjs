import coreWebVitals from "eslint-config-next/core-web-vitals";

/**
 * ESLint 9 flat config：与 Next.js 16 自带的 eslint-config-next 对齐。
 * highclaw-portal 与 shipany-template-pro 此前均未提交该文件，导致 `eslint .` 直接报错。
 */
const eslintConfig = [...coreWebVitals];

export default eslintConfig;
