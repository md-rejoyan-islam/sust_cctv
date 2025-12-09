"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { zoneSchema, type ZoneFormData } from "@/lib/validation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ZoneDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ZoneFormData) => Promise<void>
  initialData?: ZoneFormData
  title?: string
}

export function ZoneDialog({ open, onOpenChange, onSubmit, initialData, title = "Add Zone" }: ZoneDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ZoneFormData>({
    resolver: zodResolver(zoneSchema),
    defaultValues: initialData,
  })

  const handleFormSubmit = async (data: ZoneFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      await onSubmit(data)
      reset()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save zone")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Enter the zone details</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Zone Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Zone Name</label>
            <Input {...register("name")} placeholder="e.g., Zone A" disabled={isLoading} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input {...register("location")} placeholder="e.g., North Campus" disabled={isLoading} />
            {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              {...register("description")}
              placeholder="Enter zone description..."
              disabled={isLoading}
              className="min-h-24"
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Zone"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
