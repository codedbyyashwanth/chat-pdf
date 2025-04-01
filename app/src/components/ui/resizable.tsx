import * as React from "react"
import { cn } from "@/lib/utils"

interface ResizablePanelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical"
}

interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSize?: number
  minSize?: number
}

interface ResizableHandleProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ResizablePanelGroup({
  className,
  direction = "horizontal",
  ...props
}: ResizablePanelGroupProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "horizontal" ? "flex-row" : "flex-col",
        className
      )}
      {...props}
    />
  )
}

export function ResizablePanel({
  className,
  defaultSize = 50,
  minSize = 30,
  ...props
}: ResizablePanelProps) {
  return (
    <div
      className={cn("relative", className)}
      style={{ flex: defaultSize, minWidth: `${minSize}%` }}
      {...props}
    />
  )
}

export function ResizableHandle({
  className,
  ...props
}: ResizableHandleProps) {
  return (
    <div
      className={cn(
        "w-1 bg-border hover:bg-primary/50 transition-colors cursor-col-resize",
        className
      )}
      {...props}
    />
  )
} 