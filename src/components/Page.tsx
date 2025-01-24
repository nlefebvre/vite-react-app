import { PropsWithChildren, useEffect } from "react";

const Page = (props: PropsWithChildren<{ title?: string }>) => {
  useEffect(() => {
    document.title = props.title || "";
  }, [props.title]);
  return props.children;
};

export default Page;