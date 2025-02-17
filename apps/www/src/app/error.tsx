"use client";

import { BlackjackButton } from '@/lib/components/ui/blackjack/blackjack-button';
import type { Component } from '@/lib/components/utils/component';
import { IterationCcw } from 'lucide-react';
import { useEffect } from 'react'

const Error: Component<{
  error: Error & { digest?: string }
  reset: () => void
}> = ({ error, reset }) => {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      <h2 className="text-3xl font-bold">
        An error occurred
      </h2>

      <p className="mb-4">
        {error.message}
      </p>

      <BlackjackButton onClick={reset}>
        <IterationCcw className="w-4 h-4 mr-2" />
        Try again
      </BlackjackButton>
    </div>
  )
}

export default Error