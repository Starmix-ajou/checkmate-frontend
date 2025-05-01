'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { Check, Upload, X } from 'lucide-react'
import * as React from 'react'

interface FileUploadProps {
  onFileChange?: (file: File | null) => void
  onSkipChange?: (skip: boolean) => void
  value?: File | null
  skip?: boolean
  className?: string
  accept?: string
}

export function FileUpload({
  className,
  onFileChange,
  onSkipChange,
  value,
  skip,
  accept,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)

  const handleFileChange = (selectedFile: File | null) => {
    onFileChange?.(selectedFile)
  }

  const handleRemove = () => {
    onFileChange?.(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileChange(droppedFile)
    }
  }

  return (
    <div className="flex-1 space-y-4">
      <div
        className={cn(
          'flex min-h-[120px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-muted-foreground/25 hover:border-primary/50',
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = accept || '*/*'
          input.onchange = (e) => {
            const target = e.target as HTMLInputElement
            handleFileChange(target.files?.[0] || null)
          }
          input.click()
        }}
      >
        {value ? (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{value.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                handleRemove()
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">
                파일을 여기에 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOC, DOCX 파일만 업로드 가능
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="skip"
          checked={skip}
          onCheckedChange={(checked) => onSkipChange?.(!!checked)}
        />
        <label
          htmlFor="skip"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          파일 업로드 없이 건너뛰기
        </label>
      </div>
    </div>
  )
}
