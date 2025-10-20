import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Image metadata
export const alt = "News & Research | Akili Energy";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  const logoData = await readFile(join(process.cwd(), "public/images/akili-logo.png"), "base64");
  const logoSrc = `data:image/png;base64,${logoData}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 60,
          color: "black",
          background: "#f6f6f6",
          width: "100%",
          height: "100%",
          paddingTop: 50,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          alt={alt}
          width="256"
          height="256"
          src={logoSrc}
          style={{
            borderRadius: 128,
          }}
        />
        <p>{alt}</p>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
