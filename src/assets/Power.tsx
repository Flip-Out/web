export default function Power({ className }: { className: string }) {
  return (
    <svg
      width="56"
      height="45"
      viewBox="0 0 56 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g filter="url(#filter0_d_1273_5175)">
        <path
          d="M36 25.5C36 29.9183 32.4183 33.5 28 33.5C23.5817 33.5 20 29.9183 20 25.5C20 25.3079 20.0068 25.1173 20.0201 24.9286H35.9799C35.9932 25.1173 36 25.3079 36 25.5Z"
          fill="#FF4DC3"
        />
        <path
          d="M28 17.5C26.1314 17.5 24.4124 18.1406 23.0507 19.2143H32.9493C31.5876 18.1406 29.8686 17.5 28 17.5Z"
          fill="#FF4DC3"
        />
        <path
          d="M34.1281 20.3571H21.8719C21.5729 20.713 21.3044 21.0953 21.0703 21.5H34.9297C34.6956 21.0953 34.4271 20.713 34.1281 20.3571Z"
          fill="#FF4DC3"
        />
        <path
          d="M35.4747 22.6429H20.5253C20.3843 23.0115 20.2698 23.3932 20.1841 23.7857H35.8159C35.7302 23.3932 35.6157 23.0115 35.4747 22.6429Z"
          fill="#FF4DC3"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_1273_5175"
          x="0"
          y="0.5"
          width="56"
          height="56"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="10" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 0.298039 0 0 0 0 0.764706 0 0 0 0.8 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1273_5175"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1273_5175"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
