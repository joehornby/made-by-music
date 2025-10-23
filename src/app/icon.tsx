import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="none"
          viewBox="0 0 32 32"
        >
          <g clipPath="url(#clip0_252_773)">
            <rect width="32" height="32" fill="#FACD66" rx="10"></rect>
            <mask
              id="mask0_252_773"
              width="32"
              height="32"
              x="0"
              y="0"
              maskUnits="userSpaceOnUse"
              style={{ maskType: "luminance" }}
            >
              <path fill="#fff" d="M32 0H0v32h32z"></path>
            </mask>
            <g fill="#1D2123" mask="url(#mask0_252_773)">
              <path d="m15.506 6.88-3.779.814a.606.606 0 0 0-.48.592v6.504a2.6 2.6 0 0 0-.857-.144c-1.32 0-2.39.969-2.39 2.165 0 1.195 1.07 2.165 2.39 2.165.907 0 1.815-.493 2.192-1.334.327-.73.198-1.61.198-2.393v-5.2l5.205-1.208a2.043 2.043 0 0 0-2.479-1.961"></path>
              <path d="M23.345 10.696a.534.534 0 0 1 .648.52v9.245q0 .157.004.311c.01.624.02 1.211-.353 1.774a2.49 2.49 0 0 1-2.041 1.09c-1.32 0-2.39-.97-2.39-2.165s1.07-2.165 2.39-2.165q.367 0 .72.1a.107.107 0 0 0 .137-.102v-5.703a.177.177 0 0 0-.218-.172l-5.067 1.176a.18.18 0 0 0-.138.173v5.664q.002.256.012.523c.023.636.046 1.298-.21 1.87-.377.84-1.285 1.333-2.192 1.333-1.32 0-2.39-.969-2.39-2.165 0-1.195 1.07-2.165 2.39-2.165.243 0 .486.034.72.1a.108.108 0 0 0 .137-.101v-6.964a.606.606 0 0 1 .48-.591z"></path>
            </g>
          </g>
          <defs>
            <clipPath id="clip0_252_773">
              <rect width="32" height="32" fill="#fff" rx="10"></rect>
            </clipPath>
          </defs>
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
