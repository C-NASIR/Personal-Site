import type { ComponentProps } from "react";

export const mdxComponents = {
  h2: (props: ComponentProps<"h2">) => (
    <h2 className="mt-8 text-2xl font-semibold text-green-50" {...props} />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="mt-6 text-xl font-semibold text-green-100" {...props} />
  ),
  p: (props: ComponentProps<"p">) => (
    <p className="mb-4 leading-relaxed text-green-100/90" {...props} />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul className="mb-4 list-disc pl-6 text-green-100/90" {...props} />
  ),
  li: (props: ComponentProps<"li">) => <li className="mb-2" {...props} />,
  a: (props: ComponentProps<"a">) => (
    <a
      className="text-green-300 underline decoration-green-500/60 underline-offset-4 hover:text-green-50"
      {...props}
    />
  ),
};

