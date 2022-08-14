import React, { forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import { ReactComponent as Icon } from "./icon.svg";

export const Input = forwardRef<
  HTMLInputElement,
  {
    styles: React.CSSProperties;
    custom: { value: string; placeholder: string };
    onChange: (value: string) => void;
  }
>((props, ref) => {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange(e.target.value);
    },
    [props]
  );
  return (
    <input
      ref={ref}
      style={props.styles}
      onChange={onChange}
      placeholder={props.custom.placeholder}
      value={props.custom.value}
    />
  );
});

const cssTreeOptions: CSSTreeOptions = {
  flexContainerOptions: false,
  flexChildOptions: true,
  positionOptions: true,
  typographyOptions: true,
  spacingOptions: true,
  sizeOptions: true,
  borderOptions: true,
  backgroundOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    value: "text",
    placeholder: "text",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Input", category: "Basics" },
  render: {
    comp: Input,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          boxSizing: "border-box",
          fontVariant: "tabular-nums",
          fontFeatureSettings: "tnum",
          paddingTop: "4px",
          paddingLeft: "11px",
          paddingBottom: "4px",
          paddingRight: "11px",
          color: "#000000d9",
          fontSize: "14px",
          backgroundColor: "#fff",
          backgroundImage: "none",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#d9d9d9",
          borderRadius: "2px",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          value: "",
          placeHolder: "Placeholder Text",
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onChange: [{ type: "controlled", selector: ["custom", "value"] }],
    },
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Input", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: { name: "Input", containerStyle: { padding: "1rem" }, svg: Icon },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
