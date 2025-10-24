import { ChartAreaInteractive } from "~/components/chart-area-interactive"
import { DataTable } from "~/components/data-table"
import { SectionCards } from "~/components/section-cards"
import data from "../dashboard/data.json"
import { useEffect, useRef, useState } from "react"
import { DataTableSkeleton } from "~/dashboard/data-table-skleton"
import { ChartAreaInteractiveSkeleton } from "~/dashboard/chart-area-interactive-skeleton"

export default function Page() {
  const [showChart, setShowChart] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === chartRef.current) {
            setShowChart(true)
          } else if (entry.target === tableRef.current) {
            setShowTable(true)
          }
        }
      })
    }, { 
      rootMargin: '50px', // Load 50px sebelum element masuk viewport
      threshold: 0.1 
    })

    if (chartRef.current) observer.observe(chartRef.current)
    if (tableRef.current) observer.observe(tableRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          
          <div ref={chartRef}>
            {showChart ? (
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
            ) : (
              <div className="px-4 lg:px-6">
              <ChartAreaInteractiveSkeleton />
              </div>
            )}
          </div>
          
          <div ref={tableRef}>
            {showTable ? (
              <DataTable data={data} />
            ) : (
              <DataTableSkeleton />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}