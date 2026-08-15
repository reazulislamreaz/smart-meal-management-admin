import { useState } from "react";

export const DEFAULT_USER_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";

export interface UserAvatarProps {
  src?: string | null;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  fallbackIndex?: number;
}

export function UserAvatar({
  src,
  name = "User",
  className = "w-[20px] h-[20px] rounded-full object-cover shrink-0",
  style,
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const isInvalidUrl =
    !src ||
    src.trim() === "" ||
    src.includes("sample.jpg") ||
    src.includes("s3.eu-north-1.amazonaws.com") ||
    src.includes("undefined") ||
    src.includes("null");

  const effectiveSrc = hasError || isInvalidUrl ? DEFAULT_USER_AVATAR : src;

  return (
    <img
      src={effectiveSrc}
      alt={name || "User avatar"}
      className={className}
      style={style}
      onError={() => {
        if (!hasError) {
          setHasError(true);
        }
      }}
      loading="lazy"
    />
  );
}

export default UserAvatar;
