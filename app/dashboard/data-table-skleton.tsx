import { useIsMobile } from "~/hooks/use-mobile"
import { Skeleton } from "~/components/ui/skeleton"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import {
  IconLayoutColumns,
  IconPlus,
} from "@tabler/icons-react"

export function DataTableSkeleton() {
  const isMobile = useIsMobile()
  
  // Skeleton untuk baris tabel
  const TableRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-4 rounded" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-4 rounded" />
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-20 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-16 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-16 ml-auto" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-16 ml-auto" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-9 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-8 rounded" />
      </TableCell>
    </TableRow>
  )

  return (
    <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        {/* Skeleton untuk view selector */}
        <Skeleton className="h-9 w-32 @4xl/main:hidden" />
        
        {/* Skeleton untuk tabs */}
        <TabsList className="hidden @4xl/main:flex gap-2">
          {["Outline", "Past Performance", "Key Personnel", "Focus Documents"].map((tab) => (
            <TabsTrigger key={tab} value={tab.toLowerCase().replace(' ', '-')} disabled>
              <Skeleton className="h-5 w-20" />
            </TabsTrigger>
          ))}
        </TabsList>
        
        {/* Skeleton untuk buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <IconLayoutColumns />
            <span className="hidden lg:inline">Customize Columns</span>
            <span className="lg:hidden">Columns</span>
          </Button>
          <Button variant="outline" size="sm" disabled>
            <IconPlus />
            <span className="hidden lg:inline">Add Section</span>
          </Button>
        </div>
      </div>
      
      <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        {/* Skeleton untuk tabel */}
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow>
                {[
                  { width: "w-8" },
                  { width: "w-12" },
                  { width: "w-auto" },
                  { width: "w-32" },
                  { width: "w-24" },
                  { width: "w-20" },
                  { width: "w-20" },
                  { width: "w-36" },
                  { width: "w-12" },
                ].map((col, index) => (
                  <TableHead key={index}>
                    <Skeleton className={`h-4 ${col.width}`} />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Render 5 baris skeleton */}
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRowSkeleton key={index} />
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Skeleton untuk pagination */}
        <div className="flex items-center justify-between px-4">
          <Skeleton className="h-4 w-48 hidden lg:block" />
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-20" />
            </div>
            <Skeleton className="h-4 w-24" />
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-8" />
              ))}
            </div>
          </div>
        </div>
      </TabsContent>
      
      {/* Skeleton untuk tab content lainnya */}
      {["past-performance", "key-personnel", "focus-documents"].map((tab) => (
        <TabsContent key={tab} value={tab} className="flex flex-col px-4 lg:px-6">
          <Skeleton className="aspect-video w-full flex-1 rounded-lg" />
        </TabsContent>
      ))}
    </Tabs>
  )
}

// Skeleton untuk drawer/table cell viewer
export function TableCellViewerSkeleton() {
  const isMobile = useIsMobile()
  
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      {!isMobile && (
        <>
          {/* Chart skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-40 w-full rounded" />
            <Separator />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
            <Separator />
          </div>
        </>
      )}
      
      {/* Form fields skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9 w-full" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
      
      {/* Footer buttons */}
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
      </div>
    </div>
  )
}