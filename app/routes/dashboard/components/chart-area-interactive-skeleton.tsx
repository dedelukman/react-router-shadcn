import { useIsMobile } from "~/hooks/use-mobile"
import { Skeleton } from "~/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "~/components/ui/toggle-group"

export function ChartAreaInteractiveSkeleton() {
  const isMobile = useIsMobile()

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex flex-col gap-2">
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48 hidden @[540px]/card:block" />
            <Skeleton className="h-4 w-24 @[540px]/card:hidden" />
          </CardDescription>
        </div>
        
        {/* Skeleton untuk toggle group/select */}
        <div className="flex justify-end">
          <div className="hidden @[767px]/card:flex">
            <ToggleGroup type="single" value="90d" variant="outline" className="*:data-[slot=toggle-group-item]:!px-4">
              {["Last 3 months", "Last 30 days", "Last 7 days"].map((item) => (
                <ToggleGroupItem key={item} value={item.toLowerCase().replace(/ /g, '')} disabled>
                  <Skeleton className="h-4 w-20" />
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="flex @[767px]/card:hidden">
            <Select disabled>
              <SelectTrigger className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate" size="sm">
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {["Last 3 months", "Last 30 days", "Last 7 days"].map((item) => (
                  <SelectItem key={item} value={item.toLowerCase().replace(/ /g, '')} className="rounded-lg">
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {/* Skeleton untuk chart area */}
        <div className="aspect-auto h-[250px] w-full">
          <div className="flex h-full w-full flex-col">
            {/* X-axis skeleton */}
            <div className="flex h-[30px] items-center justify-between px-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-3 w-12" />
              ))}
            </div>
            
            {/* Chart area skeleton dengan grid lines */}
            <div className="relative flex-1">
              {/* Grid lines horizontal */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center">
                    <Skeleton className="h-[1px] w-full" />
                  </div>
                ))}
              </div>
              
              {/* Area chart skeleton */}
              <div className="absolute inset-0 flex items-end">
                {/* Mobile area */}
                <div className="relative flex-1">
                  <div className="absolute bottom-0 left-0 right-0">
                    <Skeleton className="h-32 w-full rounded-t-lg opacity-60" />
                  </div>
                  {/* Mobile line */}
                  <div className="absolute bottom-32 left-0 right-0 h-0.5">
                    <Skeleton className="h-1 w-full" />
                  </div>
                </div>
                
                {/* Desktop area */}
                <div className="relative flex-1">
                  <div className="absolute bottom-0 left-0 right-0">
                    <Skeleton className="h-40 w-full rounded-t-lg opacity-40" />
                  </div>
                  {/* Desktop line */}
                  <div className="absolute bottom-40 left-0 right-0 h-0.5">
                    <Skeleton className="h-1 w-full" />
                  </div>
                </div>
              </div>
              
              {/* Y-axis labels skeleton */}
              <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-3 w-8" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Alternatif simpler version jika yang di atas terlalu kompleks
export function ChartAreaInteractiveSkeletonSimple() {
  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Chart header skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          
          {/* Main chart skeleton */}
          <div className="h-[200px] w-full rounded-lg border border-dashed bg-muted/20">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Skeleton className="mx-auto h-8 w-8 rounded-full" />
                <Skeleton className="mt-2 h-4 w-24" />
                <Skeleton className="mt-1 h-3 w-32" />
              </div>
            </div>
          </div>
          
          {/* Legend skeleton */}
          <div className="flex justify-center gap-4">
            {["Desktop", "Mobile"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}