import { cn } from "@/lib/utils";

type Variant =
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "body-sm"
  | "caption"
  | "label"
  | "legend";

const variants: Record<Variant, string> = {
  h1: "heading-1",
  h2: "heading-2",
  h3: "heading-3",
  body: "body",
  "body-sm": "body-sm",
  caption: "caption",
  label: "label",
  legend: "legend",
};

const defaultElement: Record<Variant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  body: "p",
  "body-sm": "p",
  caption: "span",
  label: "label",
  legend: "legend",
};

type Props<T extends React.ElementType> = {
  as?: T;
  variant?: Variant;
  className?: string;
} & React.ComponentPropsWithoutRef<T>;

export default function Typography<T extends React.ElementType = "p">({
  as,
  variant = "body",
  className,
  ...props
}: Props<T>) {
  const Component = as || defaultElement[variant];

  return (
    <Component
      className={cn("text-inherit", variants[variant], className)}
      {...props}
    />
  );
}