import clsx from "clsx";
import type { ComponentProps } from "react";

type CodeProps = ComponentProps<"code"> & {
  "data-language"?: string;
};

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
    <ul className="mb-4 list-disc space-y-2 pl-6 text-green-100/90" {...props} />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol className="mb-4 list-decimal space-y-2 pl-6 text-green-100/90" {...props} />
  ),
  li: (props: ComponentProps<"li">) => <li {...props} />,
  a: (props: ComponentProps<"a">) => (
    <a
      className="text-green-300 underline decoration-green-500/60 underline-offset-4 hover:text-green-50"
      {...props}
    />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="mb-6 border-l-4 border-green-500/60 bg-black/30 px-5 py-3 text-base italic text-green-200"
      {...props}
    />
  ),
  hr: (props: ComponentProps<"hr">) => (
    <hr className="my-8 border-green-900/40" {...props} />
  ),
  table: (props: ComponentProps<"table">) => (
    <div className="mb-6 mt-4 overflow-x-auto rounded border border-green-900/40 bg-black/30">
      <table className="w-full table-auto border-collapse text-sm text-green-100">
        {props.children}
      </table>
    </div>
  ),
  thead: (props: ComponentProps<"thead">) => (
    <thead className="bg-green-900/20 uppercase tracking-[0.3em]" {...props} />
  ),
  tbody: (props: ComponentProps<"tbody">) => (
    <tbody className="divide-y divide-green-900/40" {...props} />
  ),
  tr: (props: ComponentProps<"tr">) => (
    <tr className="even:bg-green-900/10" {...props} />
  ),
  th: (props: ComponentProps<"th">) => (
    <th className="px-4 py-3 text-left text-xs font-semibold text-green-200" {...props} />
  ),
  td: (props: ComponentProps<"td">) => (
    <td className="px-4 py-3 align-top text-green-100/90" {...props} />
  ),
  code: (props: CodeProps) => {
    const { className, ...rest } = props;
    const language = props["data-language"];
    const isBlock = Boolean(language);
    return (
      <code
        className={clsx(
          "font-mono",
          isBlock
            ? "text-[0.95rem] text-green-50"
            : "rounded bg-green-900/40 px-2 py-1 text-sm text-green-100",
          className,
        )}
        {...rest}
      />
    );
  },
  pre: (props: ComponentProps<"pre">) => (
    <pre
      className={clsx(
        "relative mb-6 mt-4 overflow-auto rounded-xl border border-green-900/50 bg-[#171717] p-5 text-sm leading-relaxed shadow-inner shadow-black/40",
        props.className,
      )}
      {...props}
    />
  ),
};
