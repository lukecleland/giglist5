export const DownArrowIcon = ({
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
        stroke={fill}
        d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
      />
    </svg>
  );
};
