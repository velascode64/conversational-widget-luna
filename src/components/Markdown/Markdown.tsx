import { memo, useMemo } from "react";
import ReactMarkdown, { Components, Options } from "react-markdown";
import remarkGfm from "remark-gfm";

const DEFAULT_COMPONENTS: Partial<Components> = {
  // Make all links open in a new tab
  a: ({ children, ...props }) => {
    return (
      <a {...props} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },

  table: ({ children, ...props }) => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full overflow-x-auto text-xs" {...props}>
          {children}
        </table>
      </div>
    );
  },
};

interface MarkdownProps extends Options {
  children: string;
}

/**
 * A wrapper around react-markdown with custom component rendering
 * All links automatically open in a new tab
 */
function Markdown({ children, components, ...rest }: MarkdownProps) {
  const mergedComponents = useMemo(() => {
    return {
      ...DEFAULT_COMPONENTS,
      ...components,
    };
  }, [components]);

  return (
    <ReactMarkdown
      components={mergedComponents}
      remarkPlugins={[remarkGfm]}
      {...rest}
    >
      {children}
    </ReactMarkdown>
  );
}

export default memo(Markdown);
