import Typography  from "./Typography";

export const H1 = (props: React.ComponentProps<"h1">) => (
  <Typography as="h1" variant="h1" {...props} />
);

export const H2 = (props: React.ComponentProps<"h2">) => (
  <Typography as="h2" variant="h2" {...props} />
);

export const H3 = (props: React.ComponentProps<"h3">) => (
  <Typography as="h3" variant="h3" {...props} />
);

export const Body = (props: React.ComponentProps<"p">) => (
  <Typography as="p" variant="body" {...props} />
);

export const BodySm = (props: React.ComponentProps<"p">) => (
  <Typography as="p" variant="body-sm" {...props} />
);

export const Caption = (props: React.ComponentProps<"span">) => (
  <Typography as="span" variant="caption" {...props} />
);

export const Label = (props: React.ComponentProps<"label">) => (
  <Typography as="label" variant="label" {...props} />
);

export const Legend = (props: React.ComponentProps<"legend">) => (
  <Typography as="legend" variant="legend" {...props} />
);