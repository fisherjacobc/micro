import { GetFileData } from "@micro/api";
import Head from "next/head";

export const FileEmbedImage = ({ file }: { file: GetFileData }) => {
  return (
    <>
      <Head>
        <meta name="twitter:image" content={file.urls.direct} />
        <meta property="og:image" content={file.urls.direct} />
      </Head>
      <img className="object-contain h-full" src={file.urls.direct} alt={file.displayName} />
    </>
  );
};

FileEmbedImage.embeddable = (file: GetFileData) => {
  switch (file.type) {
    case "image/png":
    case "image/jpeg":
    case "image/gif":
    case "image/svg+xml":
    case "image/webp":
    case "image/bmp":
    case "image/tiff":
      return true;
    default:
      return false;
  }
};