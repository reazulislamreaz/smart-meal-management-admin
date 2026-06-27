export function IncomeRing() {
  return (
    <div className="bg-white border border-[#e5e7ea] rounded-[7px] overflow-hidden min-h-[270px] pt-[19px] px-[18px] text-center max-[620px]:min-h-[260px]">
      <h3 className="text-left m-0 text-[24px]">Monthly income</h3>
      <p className="text-left m-0 mt-[5px] text-[#8a8d92] text-[16px]">
        Your income property calculated each month.
      </p>
      <div className="w-[126px] h-[78px] overflow-hidden mx-auto mt-3 mb-[-2px] relative before:content-[''] before:absolute before:inset-0 before:w-[126px] before:h-[126px] before:border-[10px] before:border-[#c6c8cc] before:border-r-[#18191b] before:border-t-[#18191b] before:rounded-full before:-rotate-45">
        <span className="absolute top-[43px] left-0 right-0 text-[18px] font-extrabold">
          45.75%
        </span>
      </div>
      <small className="block text-[#777b81] text-[16px] leading-[1.4]">
        You earn $500K yearly. It is higher than last month.
        <br />
        Keep up your good work!
      </small>
      <div className="h-[51px] mt-3 mx-[-18px] bg-[#e5faed] grid grid-cols-3 items-center">
        <div className="flex flex-col gap-1">
          <span className="text-[#676b70] text-[8px]">Today</span>
          <strong className="text-[10px]">
            $30K <i className="text-[#1ab55a]">↑</i>
          </strong>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[#676b70] text-[8px]">Weekly</span>
          <strong className="text-[10px]">
            $30K <i className="text-[#1ab55a]">↑</i>
          </strong>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[#676b70] text-[8px]">Monthly</span>
          <strong className="text-[10px]">
            $30K <i className="text-[#1ab55a]">↑</i>
          </strong>
        </div>
      </div>
    </div>
  );
}
export default IncomeRing;
