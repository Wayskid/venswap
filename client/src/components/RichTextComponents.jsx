import React from "react";

export const RichTextComponents = {
  types: {
    image: ({ value }) => <img src={value.imageUrl} />,
    callToAction: ({ value, isInline }) =>
      isInline ? (
        <a href={value.url}>{value.text}</a>
      ) : (
        <div className="callToAction">{value.text}</div>
      ),
  },

  list: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => <ul className="mt-xl">{children}</ul>,
    number: ({ children }) => <ol className="mt-lg">{children}</ol>,

    // Ex. 2: rendering custom lists
    checkmarks: ({ children }) => (
      <ol className="m-auto text-lg">{children}</ol>
    ),
  },

  block: {
    // Ex. 1: customizing common block types
    h1: ({ children }) => <h1 className="text-5xl font-bold">{children}</h1>,
    h2: ({ children }) => <h2 className="text-4xl font-bold">{children}</h2>,
    h3: ({ children }) => (
      <h3 className="text-3xl font-semibold">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-2xl font-semibold">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-[#F99F1C]">{children}</blockquote>
    ),

    // Ex. 2: rendering custom styles
    customHeading: ({ children }) => (
      <h2 className="text-lg text-primary text-purple-700">{children}</h2>
    ),
  },

  listItem: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => (
      <li style={{ listStyleType: "disc" }} className="list-inside">
        {children}
      </li>
    ),

    // Ex. 2: rendering custom list items
    checkmarks: ({ children }) => <li>✅ {children}</li>,
  },

  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      return (
        <a href={value.href} rel={rel} target="_blank" className="text-Blue">
          {children}
        </a>
      );
    },
  },
};
