import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import { useHistory } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { Button } from "@futurewiz-rms/mint";
import styles from "./index.module.css";

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const history = useHistory();
  const version = siteConfig.customFields?.version as string;
  return (
    <Layout title="MINT" description="MINT Design System">
      <main className={styles.hero}>
        <span className="text-label-2-semibold text-brand-primary">v{version}</span>
        <h1 className={`text-display-1-bold text-text-primary ${styles.title}`}>
          Mint to Coin,
          <br />
          Coin to CryptoLab
        </h1>
        <p className={`text-body-2-regular text-text-secondary ${styles.sub}`}>
          같은 틀로 찍어 낸 컴포넌트로 크립토랩의 모든 화면을 만듭니다.
        </p>
        <div className={styles.actions}>
          <Button size="lg" onClick={() => history.push("/docs/intro")}>
            시작하기
          </Button>
          <Button
            size="lg"
            variant="line"
            onClick={() => history.push("/docs/components/common/button")}
          >
            컴포넌트 보기
          </Button>
        </div>
      </main>
    </Layout>
  );
}
