import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";


const buttonVariants = cva(
  // 🔹 base styles (shared across everything)
    "px-4 py-2 min-w-32 w-fit rounded transition hover:cursor-pointer " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "disabled:opacity-60 disabled:pointer-events-none active:translate-y-1",

    {
        variants: {
            variant: {
                primary: "bg-deep text-whitesmoke hover:bg-darker active:bg-darkest  dark:bg-whitesmoke dark:text-deep dark:hover:bg-fog dark:active:bg-ash",
                secondary: "bg-transparent border border-border hover:bg-fog active:bg-ash  dark:hover:bg-surface-1 dark:active:bg-darkest  ",
                ghost: "bg-transparent hover:bg-fog active:bg-ash  dark:text-else dark:hover:text-main dark:hover:bg-darkest dark:active:bg-darker",
            },
        }
    }
)

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost"
}

export default function Button({ 
    variant="primary",
    children,
    className="",
    type='button',
    ...props 
}: Props) {
    return (
        <button
            type={type}
            className={cn(buttonVariants({ variant }), className)}
            {...props}
        >
            {children}
        </button>
    )
}