import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { User, FileText, DollarSign, Utensils, ChevronRight, TrendingUp } from 'lucide-react'

export const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') ?? ''

  // Recent Signups dummy data
  const recentSignups = useMemo(() => {
    return [
      { id: '1', name: 'Shahed Rahman', date: '2024-03-12', plan: 'Annual', letter: 'S' },
      { id: '2', name: 'Priya Mehta', date: '2024-04-05', plan: 'Monthly', letter: 'P' },
      { id: '3', name: 'James Okafor', date: '2024-08-20', plan: 'Trial', letter: 'J' },
      { id: '4', name: 'Elif Kaya', date: '2024-01-30', plan: 'Annual', letter: 'E' },
      { id: '5', name: 'Marcus Williams', date: '2024-02-14', plan: 'Monthly', letter: 'M' }
    ].filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery])

  // Top Meals dummy data
  const topMeals = useMemo(() => {
    return [
      { id: '1', rank: '#1', name: 'Chicken & Veg Traybake', info: 'Dinner · British', count: '18.4k' },
      { id: '2', rank: '#2', name: 'Salmon Rice Bowls', info: 'Dinner · Asian', count: '16.2k' },
      { id: '3', rank: '#3', name: 'Halloumi & Couscous', info: 'Lunch · Mediterranean', count: '13.4k' },
      { id: '4', rank: '#4', name: 'Overnight Oats', info: 'Breakfast · American', count: '12.8k' },
      { id: '5', rank: '#5', name: 'Veggie Curry', info: 'Dinner · Indian', count: '11.9k' }
    ].filter(meal => 
      meal.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      meal.info.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  return (
    <div className="font-sans text-[#111214] animate-[fadeIn_0.2s_ease_forwards]">
      {/* Heading */}
      <div className="flex justify-between items-center mb-1.25">
        <h1 className="m-0 text-[21px] font-extrabold tracking-[-0.45px] leading-[1.3] text-[#111214]">Dashboard</h1>
      </div>
      <p className="m-0 mb-[18px] text-[#71757b] text-xs">Overview of your app's performance</p>

      {/* Top Layout Grid: Left (Stats Grid) & Right (Monthly Income Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Stats Grid: 2x2 layout */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          
          {/* Card 1: Total Users */}
          <div className="bg-white border border-[#e5e7ea] rounded-[7px] p-4 flex flex-col justify-between relative min-h-[120px]">
            <div>
              <div className="w-8 h-8 rounded-[6px] bg-[#17181a] text-white flex items-center justify-center mb-3.5">
                <User className="w-4.5 h-4.5" />
              </div>
              <strong className="text-[20px] font-extrabold text-[#111214] leading-none">2,543</strong>
              <p className="text-[10px] text-[#71757b] font-semibold mt-1.5 m-0">Total Users</p>
            </div>
            <span className="text-[8px] font-bold text-[#22a65b] bg-[#e3f9eb] rounded-[10px] p-[2px_8px] flex items-center gap-0.5 absolute right-4 bottom-4">
              <TrendingUp className="w-2.5 h-2.5" /> 20%
            </span>
          </div>

          {/* Card 2: Active Today */}
          <div className="bg-white border border-[#e5e7ea] rounded-[7px] p-4 flex flex-col justify-between relative min-h-[120px]">
            <div>
              <div className="w-8 h-8 rounded-[6px] bg-[#17181a] text-white flex items-center justify-center mb-3.5">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <strong className="text-[20px] font-extrabold text-[#111214] leading-none">1.3k</strong>
              <p className="text-[10px] text-[#71757b] font-semibold mt-1.5 m-0">Active Today</p>
            </div>
            <span className="text-[8px] font-bold text-[#22a65b] bg-[#e3f9eb] rounded-[10px] p-[2px_8px] flex items-center gap-0.5 absolute right-4 bottom-4">
              <TrendingUp className="w-2.5 h-2.5" /> 20%
            </span>
          </div>

          {/* Card 3: MRR */}
          <div className="bg-white border border-[#e5e7ea] rounded-[7px] p-4 flex flex-col justify-between relative min-h-[120px]">
            <div>
              <div className="w-8 h-8 rounded-[6px] bg-[#17181a] text-white flex items-center justify-center mb-3.5">
                <DollarSign className="w-4.5 h-4.5" />
              </div>
              <strong className="text-[20px] font-extrabold text-[#111214] leading-none">$10,500</strong>
              <p className="text-[10px] text-[#71757b] font-semibold mt-1.5 m-0">MRR</p>
            </div>
            <span className="text-[8px] font-bold text-[#22a65b] bg-[#e3f9eb] rounded-[10px] p-[2px_8px] flex items-center gap-0.5 absolute right-4 bottom-4">
              <TrendingUp className="w-2.5 h-2.5" /> 20%
            </span>
          </div>

          {/* Card 4: Meals Planned */}
          <div className="bg-white border border-[#e5e7ea] rounded-[7px] p-4 flex flex-col justify-between relative min-h-[120px]">
            <div>
              <div className="w-8 h-8 rounded-[6px] bg-[#17181a] text-white flex items-center justify-center mb-3.5">
                <Utensils className="w-4.5 h-4.5" />
              </div>
              <strong className="text-[20px] font-extrabold text-[#111214] leading-none">32.8k</strong>
              <p className="text-[10px] text-[#71757b] font-semibold mt-1.5 m-0">Meals Planned</p>
            </div>
            <span className="text-[8px] font-bold text-[#22a65b] bg-[#e3f9eb] rounded-[10px] p-[2px_8px] flex items-center gap-0.5 absolute right-4 bottom-4">
              <TrendingUp className="w-2.5 h-2.5" /> 20%
            </span>
          </div>

        </div>

        {/* Right Columns: Monthly Income Gauge Card */}
        <div className="lg:col-span-5 bg-white border border-[#e5e7ea] rounded-[7px] flex flex-col justify-between overflow-hidden">
          {/* Upper Pad */}
          <div className="p-4">
            <h3 className="text-sm font-bold text-left m-0 text-[#111214]">Monthly income</h3>
            <p className="mt-0.5 text-[#71757b] text-[10px] text-left m-0">See how much profit you make each month.</p>

            {/* Circular Progress Gauge */}
            <div className="w-[126px] h-[78px] overflow-hidden m-[12px_auto_0] relative flex justify-center">
              <svg width="126" height="126" viewBox="0 0 126 126" className="transform -rotate-[135deg]">
                {/* Background track */}
                <circle 
                  cx="63" 
                  cy="63" 
                  r="50" 
                  fill="none" 
                  stroke="#e2e5e9" 
                  strokeWidth="8" 
                  strokeDasharray="314" 
                  strokeDashoffset="157" 
                />
                {/* Active progress track */}
                <circle 
                  cx="63" 
                  cy="63" 
                  r="50" 
                  fill="none" 
                  stroke="#17181a" 
                  strokeWidth="8" 
                  strokeDasharray="314" 
                  strokeDashoffset={314 - (157 * 45.75) / 100}
                />
              </svg>
              {/* Text overlays */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center select-none">
                <span className="text-[16px] font-extrabold text-[#111214] leading-none">45.75%</span>
                <span className="text-[7px] font-bold text-[#22a65b] bg-[#e3f9eb] rounded-[8px] px-1.5 py-0.5 flex items-center gap-0.5 mt-0.5">
                  <TrendingUp className="w-1.5 h-1.5" /> 20%
                </span>
              </div>
            </div>

            {/* Middle caption text */}
            <p className="text-[#71757b] text-[9px] text-center max-w-[240px] mx-auto mt-2 leading-relaxed m-0">
              You earn $3287 today, it's higher than last month.<br />Keep up your good work!
            </p>
          </div>

          {/* Bottom stats row banner */}
          <div className="bg-[#e3f9eb] border-t border-[#c5eed5] p-[10px_14px] grid grid-cols-3 text-center">
            <div className="flex flex-col">
              <span className="text-[#686c72] text-[8px] font-semibold">Today</span>
              <strong className="text-[10px] font-extrabold text-[#111214] flex items-center justify-center gap-0.5">
                $20K <span className="text-[#22a65b]">↑</span>
              </strong>
            </div>
            <div className="flex flex-col border-x border-[#c5eed5]">
              <span className="text-[#686c72] text-[8px] font-semibold">Weekly</span>
              <strong className="text-[10px] font-extrabold text-[#111214] flex items-center justify-center gap-0.5">
                $20K <span className="text-[#22a65b]">↑</span>
              </strong>
            </div>
            <div className="flex flex-col">
              <span className="text-[#686c72] text-[8px] font-semibold">Monthly</span>
              <strong className="text-[10px] font-extrabold text-[#111214] flex items-center justify-center gap-0.5">
                $20K <span className="text-[#22a65b]">↑</span>
              </strong>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom panels: Recent Signups & Top Meals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        
        {/* Recent Signups panel */}
        <div className="bg-white border border-[#e5e7ea] rounded-[7px] p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-[#111214] m-0">Recent Signups</h3>
              <ChevronRight className="w-3.5 h-3.5 text-[#71757b] cursor-pointer" />
            </div>
            <div className="flex flex-col">
              {recentSignups.length > 0 ? (
                recentSignups.map((user) => (
                  <div className="border-b border-[#edf0f2] last:border-0 py-2 flex items-center justify-between" key={user.id}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#f0f2f4] text-[#555] font-bold text-xs flex items-center justify-center">
                        {user.letter}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <strong className="text-[11px] font-bold text-[#111214]">{user.name}</strong>
                        <span className="text-[8px] text-[#71757b]">{user.date}</span>
                      </div>
                    </div>
                    {user.plan === 'Annual' && (
                      <span className="text-[#22a65b] bg-[#e3f9eb] text-[8px] font-bold rounded-[3px] p-[2px_8px]">
                        Annual
                      </span>
                    )}
                    {user.plan === 'Monthly' && (
                      <span className="text-[#3480dc] bg-[#e9f3ff] text-[8px] font-bold rounded-[3px] p-[2px_8px]">
                        Monthly
                      </span>
                    )}
                    {user.plan === 'Trial' && (
                      <span className="text-[#73777c] bg-[#f0f2f4] text-[8px] font-bold rounded-[3px] p-[2px_8px]">
                        Trial
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-[#71757b] text-[10px] font-medium">
                  No matches found for search.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Meals panel */}
        <div className="bg-white border border-[#e5e7ea] rounded-[7px] p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-[#111214] m-0">Top Meals</h3>
              <ChevronRight className="w-3.5 h-3.5 text-[#71757b] cursor-pointer" />
            </div>
            <div className="flex flex-col">
              {topMeals.length > 0 ? (
                topMeals.map((meal) => (
                  <div className="border-b border-[#edf0f2] last:border-0 py-2.5 flex items-center justify-between" key={meal.id}>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-[#a1a5ad] font-bold w-4.5">{meal.rank}</span>
                      <div className="flex flex-col gap-0.5">
                        <strong className="text-[11px] font-bold text-[#111214]">{meal.name}</strong>
                        <span className="text-[8px] text-[#71757b]">{meal.info}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#71757b]">{meal.count}</span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-[#71757b] text-[10px] font-medium">
                  No matches found for search.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
