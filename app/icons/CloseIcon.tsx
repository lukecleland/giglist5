export const CloseIcon = ({
  fill = "currentColor",
  filled = false,
  size,
  height,
  width,
  ...props
}: {
  fill?: string;
  filled?: boolean;
  size?: number;
  height?: number;
  width?: number;
}) => {
  return (
    <svg
      fill={filled ? fill : "none"}
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
        stroke={fill}
      />
    </svg>
  );
};
