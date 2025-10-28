'use client'

import React, { useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning'
  onClose: () => void
  duration?: number
}

export function Toast({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icon = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
  }[type]

  const colorClass = {
    success: 'success-message',
    error: 'error-message',
    warning: 'bg-yellow-900/20 border border-yellow-500 text-yellow-400',
  }[type]

  return (
    <div className={`${colorClass} flex items-center justify-between gap-3 fixed bottom-4 right-4 z-50 min-w-[300px] animate-in slide-in-from-bottom`}>
      <div className="flex items-center gap-3">
        {icon}
        <p className="font-medium">{message}</p>
      </div>
      <button onClick={onClose} className="hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
