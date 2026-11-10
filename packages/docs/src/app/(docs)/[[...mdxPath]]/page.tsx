import { generateStaticParamsFor, importPage } from "nextra/pages";
import { useMDXComponents as getMDXComponents } from "../../../../mdx-components";

// 선택 캐치올이라 `/`(content/index.mdx, 첫 화면)도 여기서 그린다
export const generateStaticParams = generateStaticParamsFor("mdxPath");

type Props = { params: Promise<{ mdxPath?: string[] }> };

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { metadata } = await importPage(params.mdxPath ?? []);
  return metadata;
}

const Wrapper = getMDXComponents().wrapper!;

export default async function Page(props: Props) {
  const params = await props.params;
  const { default: MDXContent, toc, metadata, sourceCode } = await importPage(params.mdxPath ?? []);
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
}
