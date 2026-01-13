import * as React from 'react'

export type ToastProps = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const toast = (props: ToastProps) => {
    const message = props.title
      ? props.description
        ? `${props.title}: ${props.description}`
        : props.title
      : props.description || ''

    if (props.variant === 'destructive') {
      console.error(message)
    } else {
      console.log(message)
    }
  }

  return { toast }
}
