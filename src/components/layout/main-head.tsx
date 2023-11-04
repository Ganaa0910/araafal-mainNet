import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function MainHead() {
  const router = useRouter();
  const logo = "https://testnet.araafal.com/images/og.png";
  const title = "Araafal";
  const description = "Decentralized Raffling Solution for BRC20s";
  return (
    <Head>
      <meta property="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta property="theme-color" content="#000000" />
      <meta name="author" content="developed by Numad Labs" />
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta property="og:locale" content="en_EN" />
      <meta property="og:description" content={description} />
      <meta
        property="og:url"
        content={`https://pepepunks.art/${router.asPath}`}
      />
      <link rel="icon" type="image/png" sizes="32x32" href={logo} />
      <link rel="icon" type="image/png" sizes="96x96" href={logo} />
      <link rel="icon" type="image/png" sizes="16x16" href={logo} />
      <meta property="og:site_name" content="ordydrops.com" />
      <meta property="og:image" content={logo} key="ogimage" />
      <meta property="og:image:secure_url" content={logo} key="ogimagesecure" />
      <meta property="og:image:width" content="1170" key="ogimagewidth" />
      <meta property="og:image:height" content="630" key="ogimageheight" />
      <meta property="og:site_name" content="pepepunks.art" />
      <meta property="og:image" content={logo} />
      <meta property="og:image:secure_url" content={logo} />
    </Head>
  );
}
