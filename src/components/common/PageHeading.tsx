import type { ReactNode } from "react";

export function PageHeading({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex justify-between items-center mb-[5px] max-[620px]:gap-3 max-[620px]:items-start">
      <h1 className="m-0 text-[24px] leading-[1.3] tracking-[-.45px] max-[620px]:text-[18px]">
        {title}
      </h1>
      {action}
    </div>
  );
}
export default PageHeading;
