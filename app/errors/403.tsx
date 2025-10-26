import { ErrorLayout } from "~/components/error-layout";
import { errorData } from "~/data/error-data";


export default function Page() {
  return (
    <ErrorLayout errorConfig={errorData[403]} />
  )
}