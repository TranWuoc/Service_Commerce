  import { useToast } from "../../hooks/use-toast"
  import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
  } from "./toast"

  export function Toaster() {
    const { toasts } = useToast()
    console.log("Current Toasts:", toasts);
    return (
      <ToastProvider>
        {toasts.map(function ({ id, title, description, action, onClick, ...props }) {
          return (
            <Toast key={id} {...props} onClick={onClick}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          )
        })}
        <ToastViewport />
      </ToastProvider>
    )
  }
