'use client'

import React, { useRef, useState } from 'react'
import { Upload } from 'lucide-react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
  multiple?: boolean
  label?: string
}

export function FileUpload({
  onFileSelect,
  accept,
  maxSize,
  multiple = false,
  label = 'Upload File',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (maxSize && file.size > maxSize) {
        alert(`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`)
        return
      }
      onFileSelect(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (maxSize && file.size > maxSize) {
        alert(`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`)
        return
      }
      onFileSelect(file)
    }
  }

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-300
          ${dragActive ? 'border-cyan-star bg-cyan-star/10' : 'border-slate-600 hover:border-violet-nebula'}
        `}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-cyan-star" />
        <p className="text-white font-semibold mb-2">{label}</p>
        <p className="text-sm text-slate-400">
          Click to browse or drag and drop
        </p>
        {maxSize && (
          <p className="text-xs text-slate-500 mt-2">
            Max size: {Math.round(maxSize / 1024 / 1024)}MB
          </p>
        )}
      </div>
    </div>
  )
}
