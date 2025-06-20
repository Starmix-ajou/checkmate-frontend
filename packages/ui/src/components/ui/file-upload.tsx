'use client'

import { Badge } from '@cm/ui/components/ui/badge'
import { Button } from '@cm/ui/components/ui/button'
import { Checkbox } from '@cm/ui/components/ui/checkbox'
import { cn } from '@cm/ui/lib/utils'
import { Check, Upload, X } from 'lucide-react'
import * as React from 'react'

interface FileUploadProps {
  onFileChange?: (file: File | null) => void
  onSkipChange?: (skip: boolean) => void
  value?: File | null
  skip?: boolean
  className?: string
  accept?: string
  disabled?: boolean
}

export function FileUpload({
  className,
  onFileChange,
  onSkipChange,
  value,
  skip,
  accept,
  disabled,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)

  const handleFileChange = (selectedFile: File | null) => {
    if (disabled) return
    onFileChange?.(selectedFile)
  }

  const handleRemove = () => {
    if (disabled) return
    onFileChange?.(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return
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
          isDragging && !disabled
            ? 'border-primary bg-primary/10'
            : 'border-muted-foreground/25 hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (disabled) return
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
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">
                파일을 여기에 드래그하거나 클릭하여 업로드
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                <Badge variant="secondary" className="font-normal">
                  PDF
                </Badge>
                <Badge variant="secondary" className="font-normal">
                  DOC
                </Badge>
                <Badge variant="secondary" className="font-normal">
                  DOCX
                </Badge>
                <span className="text-muted-foreground/60">파일 형식 지원</span>
              </div>
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
